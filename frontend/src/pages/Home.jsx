import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import styles from './Home.module.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Home() {
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data),
  });

  const { data: plansData } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/plans').then(r => r.data),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => api.get('/reviews?limit=4').then(r => r.data),
  });

  const services  = servicesData?.services?.slice(0, 6)  || DEMO_SERVICES;
  const plans     = plansData?.plans                     || DEMO_PLANS;
  const reviews   = reviewsData?.reviews?.slice(0, 4)    || DEMO_REVIEWS;

  return (
    <div className={styles.page}>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <motion.div className={styles.heroContent} {...fadeUp(0)}>
            <span className={styles.heroTag}> RV Premium Car Care Studio · TADEPALLI </span>
            <h1 className={styles.heroTitle}>
              Your Car<br />Deserves<br /><em>Better.</em>
            </h1>
            <p className={styles.heroSub}>
              Professional detailing, steam cleaning, and full-care packages.
              Walk-in or book your slot online — we're open 7 days a week.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/book" className="btn btn-primary">Book a Slot →</Link>
              <Link to="/services" className="btn btn-outline" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>
                View Services
              </Link>
            </div>
          </motion.div>
          

          <motion.div className={styles.heroStats} {...fadeUp(0.2)}>
            <motion.div className={styles.heroImage} {...fadeUp(0.2)}>
             <img
  src="/images/f1-car.png"
  alt="F1 Car"
  className={styles.heroCar}
/>
</motion.div>
            {[
              { num: '4,800+', label: 'Cars Serviced' },
              { num: '12',     label: 'Bays Available' },
              { num: '4.9★',   label: 'Average Rating' },
              { num: '6+',     label: 'Years Experience' },
            ].map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Opening hours strip */}
        <div className={styles.hoursStrip}>
          <span className={styles.hoursLabel}>Hours</span>
          <span>Mon–Sat: 7AM – 9PM</span>
          <span>·</span>
          <span>Sun: 9AM – 6PM</span>
          <span className={styles.openBadge}><span className={styles.pulse} />Open Now</span>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div {...fadeUp(0)}>
            <p className="section-label">What We Offer</p>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub" style={{ marginBottom: 40 }}>
              From a quick exterior rinse to full ceramic protection — we handle it all.
            </p>
          </motion.div>
          <div className={`grid-3 ${styles.servicesGrid}`}>
            {services.map((s, i) => (
              <motion.div key={s._id || s.name} className={`card ${styles.serviceCard}`} {...fadeUp(i * 0.06)}>
                <div className={styles.svcIcon}>{s.icon}</div>
                <h3 className={styles.svcName}>{s.name}</h3>
                <p className={styles.svcDesc}>{s.shortDesc || s.description}</p>
                <div className={styles.svcMeta}>
                  <span className={styles.svcTime}>⏱ {s.duration?.min}–{s.duration?.max} min</span>
                  <span className={styles.svcPrice}>
                    from ₹{s.basePrice?.hatchback || s.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/services" className="btn btn-outline">See All Services</Link>
          </div>
        </div>
      </section>

      {/* ── PLANS PREVIEW ───────────────────────────────────────── */}
      <section className={`section ${styles.plansSection}`}>
        <div className="container">
          <p className="section-label">Pricing</p>
          <h2 className="section-title">Simple Plans</h2>
          <div className="grid-3" style={{ marginTop: 32 }}>
            {plans.map((p, i) => (
              <motion.div key={p._id || p.name}
                className={`card ${styles.planCard} ${p.isFeatured ? styles.featured : ''}`}
                {...fadeUp(i * 0.08)}>
                {p.isFeatured && <span className={styles.planBadge}>Most Popular</span>}
                <div className={styles.planIcon}>{p.icon}</div>
                <h3 className={styles.planName}>{p.displayName}</h3>
                <div className={styles.planPrice}>
                  <sup>₹</sup>{p.price?.perVisit}
                  <small>/ visit</small>
                </div>
                <p className={styles.planTagline}>{p.tagline}</p>
                <ul className={styles.planFeatures}>
                  {p.features?.slice(0, 5).map(f => (
                    <li key={f.label} className={f.included ? '' : styles.excluded}>
                      <span>{f.included ? '✓' : '✗'}</span> {f.label}
                    </li>
                  ))}
                </ul>
                <Link to="/book" className={`btn ${p.isFeatured ? 'btn-primary' : 'btn-dark'} ${styles.planBtn}`}>
                  Book {p.displayName}
                </Link>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/plans" className="btn btn-outline">Compare All Plans</Link>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">What Clients Say</h2>
          <div className="grid-2" style={{ marginTop: 32 }}>
            {reviews.map((r, i) => (
              <motion.div key={r._id || i} className={`card ${styles.reviewCard}`} {...fadeUp(i * 0.07)}>
                <div className={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p className={styles.reviewText}>"{r.comment}"</p>
                <div className={styles.reviewFooter}>
                  <strong>{r.customerName}</strong>
                  {r.vehicleModel && <span>{r.vehicleModel}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ─────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.ctaBanner}>
            <div>
              <h2 className={styles.ctaTitle}>Ready for a Spotless Ride?</h2>
              <p>Book in under 2 minutes. No deposit required.</p>
            </div>
            <Link to="/book" className="btn btn-primary" style={{ fontSize: 14, padding: '13px 32px' }}>
              Book Your Slot →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Demo fallback data (used when API is not connected)
const DEMO_SERVICES = [
  { name: 'Exterior Wash',        icon: '🚿', shortDesc: 'High-pressure foam wash with wax coat',         duration: { min: 20, max: 30  }, basePrice: { hatchback: 199 } },
  { name: 'Interior Detail',      icon: '🧴', shortDesc: 'Full vacuum, dashboard wipe, glass clean',      duration: { min: 45, max: 60  }, basePrice: { hatchback: 399 } },
  { name: 'Full Detail Package',  icon: '✨', shortDesc: 'Complete interior + exterior package',           duration: { min: 90, max: 120 }, basePrice: { hatchback: 699 } },
  { name: 'Steam Clean',          icon: '🌊', shortDesc: 'Deep-clean engine bay & upholstery',             duration: { min: 60, max: 90  }, basePrice: { hatchback: 799 } },
  { name: 'Ceramic Coating',      icon: '🛡️', shortDesc: '2-year paint protection ceramic coat',          duration: { min: 180, max: 240 }, basePrice: { hatchback: 4999 } },
  { name: 'Polish & Buff',        icon: '🔆', shortDesc: 'Swirl removal & paint restoration',              duration: { min: 120, max: 180 }, basePrice: { hatchback: 1999 } },
];
const DEMO_PLANS = [
  { name: 'basic',   displayName: 'Basic',   icon: '🚿', isFeatured: false, tagline: 'Essential daily clean', price: { perVisit: 299 }, features: [{ label: 'Exterior wash', included: true }, { label: 'Tyre clean', included: true }, { label: 'Air freshener', included: true }, { label: 'Interior vacuum', included: false }, { label: 'Wax coat', included: false }] },
  { name: 'premium', displayName: 'Premium', icon: '✨', isFeatured: true,  tagline: 'Full interior & exterior', price: { perVisit: 799 }, features: [{ label: 'Full exterior wash', included: true }, { label: 'Wax coat', included: true }, { label: 'Interior vacuum', included: true }, { label: 'Seat shampoo', included: true }, { label: 'Engine clean', included: false }] },
  { name: 'elite',   displayName: 'Elite',   icon: '🛡️', isFeatured: false, tagline: 'The complete experience', price: { perVisit: 1999 }, features: [{ label: 'Complete detail', included: true }, { label: 'Steam clean', included: true }, { label: 'Polish & buff', included: true }, { label: 'Ceramic layer', included: true }, { label: 'Priority slots', included: true }] },
];
const DEMO_REVIEWS = [
  { customerName: 'Ravi K.',  vehicleModel: '2022 Honda City', rating: 5, comment: 'Best detailing experience. The ceramic coat still looks incredible after months!' },
  { customerName: 'Priya M.', vehicleModel: 'Hyundai Creta',  rating: 5, comment: 'The steam clean removed stains I thought were permanent. Truly professional.' },
  { customerName: 'Arun S.',  vehicleModel: 'Tata Nexon EV',  rating: 4, comment: 'Great value on the premium plan. Love the online booking system.' },
  { customerName: 'Deepa R.', vehicleModel: 'Maruti Baleno',  rating: 5, comment: 'Polishing job was flawless — my 5-year-old car looks brand new!' },
];
