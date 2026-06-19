import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "../utils/api";
import styles from "./Plans.module.css";

const DEMO_PLANS = [
  {
    _id: "1",
    name: "basic",
    displayName: "Basic",
    icon: "🚿",
    isFeatured: false,
    tagline: "Essential daily clean",
    color: "#1a6bff",
    price: { perVisit: 299, monthly: 1999 },
    monthlyWashes: 8,
    discount: 0,
    features: [
      { label: "Exterior foam wash", included: true },
      { label: "Tyre & rim cleaning", included: true },
      { label: "Window wipe", included: true },
      { label: "Air freshener", included: true },
      { label: "Interior vacuum", included: false },
      { label: "Wax coat", included: false },
      { label: "Seat shampoo", included: false },
      { label: "Engine clean", included: false },
      { label: "Ceramic protection", included: false },
      { label: "Priority slots", included: false },
    ],
  },
  {
    _id: "2",
    name: "premium",
    displayName: "Premium",
    icon: "✨",
    isFeatured: true,
    tagline: "Full interior & exterior feel",
    color: "#ff4e1a",
    price: { perVisit: 799, monthly: 3999 },
    monthlyWashes: 6,
    discount: 0,
    features: [
      { label: "Exterior foam wash", included: true },
      { label: "Tyre & rim cleaning", included: true },
      { label: "Window wipe", included: true },
      { label: "Air freshener", included: true },
      { label: "Interior vacuum", included: true },
      { label: "Wax coat", included: true },
      { label: "Seat shampoo", included: true },
      { label: "Engine clean", included: false },
      { label: "Ceramic protection", included: false },
      { label: "Priority slots", included: false },
    ],
  },
  {
    _id: "3",
    name: "elite",
    displayName: "Elite",
    icon: "🛡️",
    isFeatured: false,
    tagline: "The complete experience",
    color: "#e6a817",
    price: { perVisit: 1999, monthly: 7999 },
    monthlyWashes: null,
    discount: 0,
    features: [
      { label: "Exterior foam wash", included: true },
      { label: "Tyre & rim cleaning", included: true },
      { label: "Window wipe", included: true },
      { label: "Air freshener", included: true },
      { label: "Interior vacuum", included: true },
      { label: "Wax coat", included: true },
      { label: "Seat shampoo", included: true },
      { label: "Engine clean", included: true },
      { label: "Ceramic protection", included: true },
      { label: "Priority slots", included: true },
    ],
  },
];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] },
});

export default function Plans() {
  const [billing, setBilling] = useState("visit");
  const { data } = useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get("/plans").then((r) => r.data),
  });
  const plans = data?.plans || DEMO_PLANS;
  const allFeatures = [
    ...new Set(plans.flatMap((p) => p.features.map((f) => f.label))),
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <p className="section-label">Pricing</p>
          <h1 className={styles.title}>Simple, Transparent Plans</h1>
          <p className={styles.sub}>
            No hidden charges. Pay per visit or save more with monthly
            subscriptions.
          </p>
          {/* Toggle */}
          <div className={styles.toggle}>
            <button
              className={billing === "visit" ? styles.toggleActive : ""}
              onClick={() => setBilling("visit")}
            >
              Per Visit
            </button>
            <button
              className={billing === "monthly" ? styles.toggleActive : ""}
              onClick={() => setBilling("monthly")}
            >
              Monthly <span className={styles.saveBadge}>Save up to 20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Plan Cards */}
        <div className={styles.plansGrid}>
          {plans.map((p, i) => (
            <motion.div
              key={p._id}
              className={`${styles.planCard} ${
                p.isFeatured ? styles.featured : ""
              }`}
              {...fadeUp(i * 0.08)}
            >
              {p.isFeatured && (
                <div className={styles.popularBadge}>⭐ Most Popular</div>
              )}
              <div
                className={styles.planHeader}
                style={{ borderBottom: `3px solid ${p.color}` }}
              >
                <span className={styles.planIcon}>{p.icon}</span>
                <h2 className={styles.planName}>{p.displayName}</h2>
                <p className={styles.planTagline}>{p.tagline}</p>
                <div className={styles.planPrice}>
                  <span className={styles.currency}>₹</span>
                  <span className={styles.amount}>
                    {billing === "visit" ? p.price.perVisit : p.price.monthly}
                  </span>
                  <span className={styles.period}>
                    /{billing === "visit" ? "visit" : "month"}
                  </span>
                </div>
                {billing === "monthly" && p.monthlyWashes && (
                  <p className={styles.washInfo}>
                    {p.monthlyWashes} washes included
                  </p>
                )}
                {billing === "monthly" && !p.monthlyWashes && (
                  <p className={styles.washInfo}>Unlimited washes</p>
                )}
              </div>
              <ul className={styles.featureList}>
                {p.features.map((f) => (
                  <li
                    key={f.label}
                    className={f.included ? styles.included : styles.excluded}
                  >
                    <span className={styles.check}>
                      {f.included ? "✓" : "✗"}
                    </span>
                    {f.label}
                  </li>
                ))}
              </ul>
              <Link
                to={`/book?plan=${p.name}`}
                className={`btn ${p.isFeatured ? "btn-primary" : "btn-dark"} ${
                  styles.bookBtn
                }`}
              >
                Get {p.displayName}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div className={styles.tableWrap} {...fadeUp(0.2)}>
          <h2 className={styles.tableTitle}>Full Comparison</h2>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Feature</th>
                  {plans.map((p) => (
                    <th key={p._id}>
                      {p.icon} {p.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className={styles.priceRow}>
                  <td>Price / Visit</td>
                  {plans.map((p) => (
                    <td
                      key={p._id}
                      style={{ fontWeight: 600, color: "var(--accent2)" }}
                    >
                      ₹{p.price.perVisit}
                    </td>
                  ))}
                </tr>
                {allFeatures.map((feat) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    {plans.map((p) => {
                      const f = p.features.find((x) => x.label === feat);
                      return (
                        <td key={p._id}>
                          {f?.included ? (
                            <span className={styles.yes}>✓</span>
                          ) : (
                            <span className={styles.no}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className={styles.faqSection}>
          <h2 className={styles.faqTitle}>Common Questions</h2>
          <div className={styles.faqGrid}>
            {[
              {
                q: "Can I switch plans?",
                a: "Yes, you can upgrade or downgrade your plan anytime. Changes take effect on your next booking.",
              },
              {
                q: "What vehicles do you service?",
                a: "We service all vehicle types: hatchbacks, sedans, SUVs, MUVs, and luxury cars. Pricing varies by type.",
              },
              {
                q: "Do you offer pickup & drop?",
                a: "Pickup and drop is available for Elite plan subscribers and can be added as an add-on for other plans.",
              },
              {
                q: "Is my payment secure?",
                a: "Yes. We use Razorpay for online payments which is fully PCI-DSS compliant.",
              },
            ].map(({ q, a }) => (
              <div key={q} className={styles.faqCard}>
                <h4>{q}</h4>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
