const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
   customerName: {
  type: String,
  required: true,
},

phone: {
  type: String,
  required: true,
},

email: {
  type: String,
  default: '',
},
    // Denormalized for display without populate
    customerSnapshot: {
      name:  String,
      email: String,
      phone: String,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceSnapshot: {
      name: String,
      icon: String,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
    },
    vehicle: {
      type:         { type: String, enum: ['hatchback','sedan','suv','muv','luxury'], required: true },
      make:         String,
      model:        String,
      registrationNo: String,
      color:        String,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      start: { type: String, required: true }, // e.g. "09:00"
      end:   { type: String, required: true }, // e.g. "10:00"
    },
    bay: { type: Number }, // assigned washing bay number
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    amount: {
      base:     { type: Number, required: true },
      discount: { type: Number, default: 0 },
      tax:      { type: Number, default: 0 },
      total:    { type: Number, required: true },
    },
    addOns: [
      {
        name:  String,
        price: Number,
      },
    ],
    notes: String,
    staffNotes: String,
    cancelReason: String,
    completedAt: Date,
    rating: {
      score:   { type: Number, min: 1, max: 5 },
      comment: String,
      ratedAt: Date,
    },
    reminderSent: { type: Boolean, default: false },
    confirmationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Auto-generate booking ID ────────────────────────────────────────────────
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    this.bookingId = `SPX-${dateStr}-${random}`;
  }
  next();
});

// ─── Indexes for common queries ───────────────────────────────────────────────
bookingSchema.index({ appointmentDate: 1, status: 1 });
bookingSchema.index({ phone: 1, createdAt: -1 });
bookingSchema.index({ bookingId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
