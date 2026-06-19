const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking  = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const User     = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { sendBookingConfirmation, sendCancellationEmail } = require('../config/email');

// GET /api/bookings/my — customer's own bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('service', 'name icon duration')
      .sort({ appointmentDate: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/bookings — create a new booking
router.post('/', protect, [
  body('serviceId').notEmpty().withMessage('Service is required'),
  body('vehicleType').isIn(['hatchback','sedan','suv','muv','luxury']).withMessage('Invalid vehicle type'),
  body('appointmentDate').isISO8601().withMessage('Valid date required'),
  body('timeSlot.start').notEmpty().withMessage('Start time required'),
  body('timeSlot.end').notEmpty().withMessage('End time required'),
  body('amount.total').isNumeric().withMessage('Amount required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { serviceId, planId, vehicleType, vehicleMake, vehicleModel, vehicleReg,
            appointmentDate, timeSlot, amount, addOns, notes } = req.body;

    // Check slot availability
    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);
    const slotDoc = await TimeSlot.findOne({ date: apptDate });

    if (slotDoc) {
      const slot = slotDoc.slots.find(s => s.start === timeSlot.start);
      if (slot && (slot.isBlocked || slot.booked >= slot.capacity)) {
        return res.status(400).json({ success: false, message: 'This time slot is no longer available.' });
      }
      // Increment booked count
      if (slot) {
        slot.booked += 1;
        await slotDoc.save();
      }
    }

    // Populate service details
    const Service = require('../models/Service');
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const booking = await Booking.create({
      customer: req.user._id,
      customerSnapshot: {
        name:  req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
      service: serviceId,
      serviceSnapshot: { name: service.name, icon: service.icon },
      plan: planId || undefined,
      vehicle: {
        type:           vehicleType,
        make:           vehicleMake,
        model:          vehicleModel,
        registrationNo: vehicleReg,
      },
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      amount: {
        base:     amount.base,
        discount: amount.discount || 0,
        tax:      amount.tax || 0,
        total:    amount.total,
      },
      addOns: addOns || [],
      notes,
      status: 'confirmed',
    });

    // Increment user's booking count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalBookings: 1, loyaltyPoints: 50 },
    });

    // Send confirmation email (non-blocking)
    sendBookingConfirmation({
      to:       req.user.email,
      name:     req.user.name,
      bookingId: booking.bookingId,
      service:  service.name,
      date:     booking.appointmentDate,
      timeSlot: `${timeSlot.start} – ${timeSlot.end}`,
      vehicle:  `${vehicleMake || ''} ${vehicleModel || ''} (${vehicleType})`.trim(),
      amount:   amount.total,
    }).catch(console.error);

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:id — get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
    }).populate('service', 'name icon duration category');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/bookings/:id/cancel — cancel a booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking.` });
    }

    booking.status = 'cancelled';
    booking.cancelReason = req.body.reason || 'Cancelled by customer';
    await booking.save();

    sendCancellationEmail({
      to: booking.customerSnapshot.email,
      name: booking.customerSnapshot.name,
      bookingId: booking.bookingId,
      reason: booking.cancelReason,
    }).catch(console.error);

    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
