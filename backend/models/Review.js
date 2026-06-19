const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    customerName: String,
    vehicleModel: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    tags: [String], // e.g. ['great staff', 'quick service', 'spotless clean']
    isApproved: { type: Boolean, default: false },
    isHighlighted: { type: Boolean, default: false },
    adminReply: {
      text: String,
      repliedAt: Date,
    },
  },
  { timestamps: true }
);

// One review per booking
reviewSchema.index({ booking: 1, customer: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
