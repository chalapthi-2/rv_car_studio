const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// GET public approved reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .sort({ isHighlighted: -1, createdAt: -1 })
      .limit(Number(req.query.limit) || 20);
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST a review (customer must be logged in)
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment, bookingId, tags } = req.body;
    const Booking = require('../models/Booking');
    const booking = bookingId ? await Booking.findById(bookingId) : null;

    const review = await Review.create({
      customer:     req.user._id,
      customerName: req.user.name,
      booking:      booking?._id,
      vehicleModel: booking?.vehicle?.model || req.body.vehicleModel,
      rating,
      comment,
      tags: tags || [],
    });

    res.status(201).json({ success: true, review, message: 'Review submitted and awaiting approval.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT approve/highlight review (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
