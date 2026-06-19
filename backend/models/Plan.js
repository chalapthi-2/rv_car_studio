const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['basic', 'premium', 'elite'],
    },
    displayName: { type: String, required: true },
    tagline: String,
    icon: String,
    price: {
      perVisit: { type: Number, required: true },
      monthly:  { type: Number },
    },
    monthlyWashes: { type: Number }, // for subscription plans
    features: [
      {
        label: String,
        included: Boolean,
      },
    ],
    includedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    discount: {
      type: Number,
      default: 0, // percentage
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    color: { type: String, default: '#1a6bff' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
