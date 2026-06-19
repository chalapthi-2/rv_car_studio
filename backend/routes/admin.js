const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User    = require('../models/User');
const Review  = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/dashboard — stats overview
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalBookings,
      todayBookings,
      pendingBookings,
      totalCustomers,
      completedToday,
      revenue,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ appointmentDate: { $gte: today, $lt: tomorrow } }),
      Booking.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'customer' }),
      Booking.countDocuments({ status: 'completed', updatedAt: { $gte: today } }),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount.total' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalBookings,
        todayBookings,
        pendingBookings,
        totalCustomers,
        completedToday,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/bookings — all bookings with filters
router.get('/bookings', async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.appointmentDate = { $gte: d, $lt: next };
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('service', 'name icon')
      .populate('customer', 'name email phone')
      .sort({ appointmentDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/bookings/:id — update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    const allowed = ['status', 'bay', 'staffNotes', 'paymentStatus', 'completedAt'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    if (updates.status === 'completed') updates.completedAt = new Date();

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/admin/customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/reviews — all reviews including unapproved
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
