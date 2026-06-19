const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    slots: [
      {
        start:      { type: String, required: true }, // "09:00"
        end:        { type: String, required: true }, // "10:00"
        capacity:   { type: Number, default: 3 },     // max bookings per slot
        booked:     { type: Number, default: 0 },
        isBlocked:  { type: Boolean, default: false },
        blockReason: String,
      },
    ],
    isHoliday: { type: Boolean, default: false },
    holidayName: String,
    specialHours: {
      open:  String,
      close: String,
    },
  },
  { timestamps: true }
);

timeSlotSchema.index({ date: 1 }, { unique: true });

// Virtual: available slots
timeSlotSchema.virtual('availableSlots').get(function () {
  return this.slots.filter(s => !s.isBlocked && s.booked < s.capacity);
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
