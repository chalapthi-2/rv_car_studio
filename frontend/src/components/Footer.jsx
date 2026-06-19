import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Brand column */}
        <div className={styles.brand}>
          <div className={styles.logo}>SPLASH<span>X</span></div>
          <p className={styles.brandDesc}>
            Premium car wash & detailing studio in Vijayawada. Professional care, every time.
          </p>
          <div className={styles.contact}>
            <a href="tel:+919876543210">📞 +91 91822 30364</a>
            <a href="mailto:hello@splashx.in">✉️ dasarivamsi@gmail.com</a>
            <span>📍 Prathuru Road,Beside Aparna Apartment,Kunchanapalli. AP – 520007</span>
          </div>
        </div>

        {/* Links columns */}
        <div className={styles.col}>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/plans">Pricing Plans</Link>
          <Link to="/book">Book a Slot</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>

        <div className={styles.col}>
          <h4>Services</h4>
          <span>Exterior Wash</span>
          <span>Interior Detail</span>
          <span>Full Detail Package</span>
          <span>Steam Clean</span>
          <span>Ceramic Coating</span>
          <span>Polish & Buff</span>
        </div>

        <div className={styles.col}>
          <h4>Studio Hours</h4>
          <div className={styles.hours}>
            <div className={styles.hourRow}><span>Mon – Sat</span><strong>7AM – 9PM</strong></div>
            <div className={styles.hourRow}><span>Sunday</span><strong>9AM – 6PM</strong></div>
          </div>
          <div className={styles.social}>
            <h4 style={{marginTop:16}}>Follow Us</h4>
            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/rvcarcarestudio/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://wa.me/919182230364" target="_blank" rel="noreferrer">WhatsApp</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <span>© {year} RV-SplashX Studio. All rights reserved.</span>
          <span style={{color:'var(--mute)'}}>Built with ❤️ in PCR</span>
        </div>
      </div>
    </footer>
  );
}
