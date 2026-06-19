const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Booking Confirmation ──────────────────────────────────────────────────
exports.sendBookingConfirmation = async ({ to, name, bookingId, service, date, timeSlot, vehicle, amount }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff">
      <div style="background:#0f0f0f;padding:24px 32px;text-align:center">
        <h1 style="color:#ff4e1a;margin:0;font-size:28px;letter-spacing:2px">SPLASH<span style="color:#fff">X</span></h1>
        <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px">Premium Car Wash Studio</p>
      </div>
      <div style="padding:32px">
        <h2 style="color:#0f0f0f;font-size:22px;margin:0 0 8px">Booking Confirmed! ✅</h2>
        <p style="color:#555;margin:0 0 24px">Hi ${name}, your car wash appointment is all set.</p>
        <div style="background:#f5f4f0;border-radius:10px;padding:20px;margin-bottom:24px">
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0e0e0">
            <span style="color:#888;font-size:13px">Booking ID</span>
            <strong style="font-size:13px;color:#1a6bff">${bookingId}</strong>
          </div>
          <div style="padding:8px 0;border-bottom:1px solid #e0e0e0">
            <span style="color:#888;font-size:13px">Service</span>
            <div style="font-size:14px;font-weight:600;color:#0f0f0f;margin-top:2px">${service}</div>
          </div>
          <div style="padding:8px 0;border-bottom:1px solid #e0e0e0">
            <span style="color:#888;font-size:13px">Date & Time</span>
            <div style="font-size:14px;font-weight:600;color:#0f0f0f;margin-top:2px">${formattedDate} at ${timeSlot}</div>
          </div>
          <div style="padding:8px 0;border-bottom:1px solid #e0e0e0">
            <span style="color:#888;font-size:13px">Vehicle</span>
            <div style="font-size:14px;font-weight:600;color:#0f0f0f;margin-top:2px">${vehicle}</div>
          </div>
          <div style="padding:8px 0">
            <span style="color:#888;font-size:13px">Amount</span>
            <div style="font-size:18px;font-weight:700;color:#ff4e1a;margin-top:2px">₹${amount}</div>
          </div>
        </div>
        <p style="color:#555;font-size:13px;line-height:1.6">
          Please arrive 5 minutes before your slot. Bring your vehicle registration if it's your first visit.
        </p>
        <div style="text-align:center;margin-top:24px">
          <a href="tel:+919876543210" style="background:#ff4e1a;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">Call Studio</a>
        </div>
      </div>
      <div style="background:#f5f4f0;padding:16px 32px;text-align:center">
        <p style="color:#aaa;font-size:11px;margin:0">SplashX Studio · 42, Industrial Bypass Road, Vijayawada, AP · 520007</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Booking Confirmed — ${bookingId} | SplashX Studio`,
    html,
  });
};

// ─── Booking Cancellation ──────────────────────────────────────────────────
exports.sendCancellationEmail = async ({ to, name, bookingId, reason }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Booking Cancelled — ${bookingId} | SplashX Studio`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0f0f0f;padding:24px;text-align:center">
          <h1 style="color:#ff4e1a;margin:0;font-size:24px;letter-spacing:2px">SPLASHX</h1>
        </div>
        <div style="padding:32px">
          <h2>Booking Cancelled</h2>
          <p>Hi ${name}, your booking <strong>${bookingId}</strong> has been cancelled.</p>
          ${reason ? `<p>Reason: ${reason}</p>` : ''}
          <p>If you'd like to rebook, visit our website anytime.</p>
        </div>
      </div>
    `,
  });
};
