const express = require('express');
const PDFDocument = require('pdfkit');

const router = express.Router();

router.get('/:bookingId', async (req, res) => {
  const bookingId = req.params.bookingId;

  const doc = new PDFDocument();

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice-${bookingId}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(26)
     .text('RV SplashX', {
       align: 'center'
     });

  doc.moveDown();

  doc.fontSize(16)
     .text(`Invoice ID: ${bookingId}`);

  doc.moveDown();

  doc.text('Premium Car Care Studio');
  doc.text('Payment Status: PAID');

  doc.moveDown();

  doc.text('Thank you for choosing SplashX');

  doc.end();
});

module.exports = router;