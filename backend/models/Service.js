const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      unique: true,
    },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDesc: { type: String, maxlength: 100 },
    icon: { type: String, default: '🚗' },
    category: {
      type: String,
      enum: ['exterior', 'interior', 'full', 'protection', 'specialty'],
      required: true,
    },
    duration: {
      min: { type: Number, required: true }, // in minutes
      max: { type: Number, required: true },
    },
    basePrice: {
      hatchback: { type: Number, required: true },
      sedan:     { type: Number, required: true },
      suv:       { type: Number, required: true },
      muv:       { type: Number, required: true },
      luxury:    { type: Number, required: true },
    },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// Auto-generate slug
serviceSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
