const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');
const { protect, adminOnly } = require('../middleware/auth');

// Default working hours config
const DEFAULT_SLOTS = () => {
  const slots = [];
  // 7:00 AM to 9:00 PM, hourly
  for (let h = 7; h < 21; h++) {
    const start = `${String(h).padStart(2,'0')}:00`;
    const end   = `${String(h+1).padStart(2,'0')}:00`;
    slots.push({ start, end, capacity: 3, booked: 0, isBlocked: false });
  }
  return slots;
};

// GET available slots for a date
router.get('/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    let slotDoc = await TimeSlot.findOne({ date });

    // Auto-create if not exists
    if (!slotDoc) {
      const day = date.getDay();
      const isSunday = day === 0;
      slotDoc = await TimeSlot.create({
        date,
        slots: isSunday
          ? DEFAULT_SLOTS().filter(s => parseInt(s.start) >= 9 && parseInt(s.start) < 18)
          : DEFAULT_SLOTS(),
      });
    }

    if (slotDoc.isHoliday) {
      return res.json({ success: true, isHoliday: true, holidayName: slotDoc.holidayName, slots: [] });
    }

    const available = slotDoc.slots.filter(s => !s.isBlocked && s.booked < s.capacity);
    res.json({
      success: true,
      date: slotDoc.date,
      slots: slotDoc.slots,
      availableSlots: available,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT block a slot (admin)
router.put('/:date/block', protect, adminOnly, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    const { slotStart, blockReason, isHoliday, holidayName } = req.body;

    let slotDoc = await TimeSlot.findOne({ date });
    if (!slotDoc) slotDoc = new TimeSlot({ date, slots: DEFAULT_SLOTS() });

    if (isHoliday) {
      slotDoc.isHoliday = true;
      slotDoc.holidayName = holidayName || 'Holiday';
    } else {
      const slot = slotDoc.slots.find(s => s.start === slotStart);
      if (slot) {
        slot.isBlocked = true;
        slot.blockReason = blockReason || 'Blocked by admin';
      }
    }

    await slotDoc.save();
    res.json({ success: true, slotDoc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
