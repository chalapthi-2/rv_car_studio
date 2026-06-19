import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import styles from "./MyBookings.module.css";

const STATUS_COLORS = {
  pending: "badge-amber",
  confirmed: "badge-blue",
  "in-progress": "badge-amber",
  completed: "badge-green",
  cancelled: "badge-red",
  "no-show": "badge-red",
};

const DEMO_BOOKINGS = [
  {
    _id: "1",
    bookingId: "SPX-20260505-1234",
    status: "confirmed",
    appointmentDate: "2026-05-10T00:00:00.000Z",
    timeSlot: { start: "10:00", end: "11:00" },
    serviceSnapshot: { name: "Full Detail Package", icon: "✨" },
    vehicle: { type: "sedan", make: "Honda", model: "City" },
    amount: { total: 849 },
  },
  {
    _id: "2",
    bookingId: "SPX-20260420-5678",
    status: "completed",
    appointmentDate: "2026-04-20T00:00:00.000Z",
    timeSlot: { start: "09:00", end: "10:30" },
    serviceSnapshot: { name: "Ceramic Coating", icon: "🛡️" },
    vehicle: { type: "suv", make: "Tata", model: "Nexon" },
    amount: { total: 7499 },
  },
  {
    _id: "3",
    bookingId: "SPX-20260310-9012",
    status: "cancelled",
    appointmentDate: "2026-03-10T00:00:00.000Z",
    timeSlot: { start: "14:00", end: "14:30" },
    serviceSnapshot: { name: "Exterior Wash", icon: "🚿" },
    vehicle: { type: "hatchback", make: "Maruti", model: "Swift" },
    amount: { total: 249 },
  },
];

export default function MyBookings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [cancelId, setCancelId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => api.get("/bookings/my").then((r) => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) =>
      api.put(`/bookings/${id}/cancel`, { reason: "Cancelled by customer" }),
    onSuccess: () => {
      toast.success("Booking cancelled.");
      qc.invalidateQueries(["my-bookings"]);
      setCancelId(null);
    },
    onError: () => toast.error("Could not cancel booking."),
  });

  const bookings = data?.bookings || DEMO_BOOKINGS;
  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter((b) =>
      ["pending", "confirmed"].includes(b.status)
    ).length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  /* payment */
  const handlePayment = async (booking) => {
    alert(
      `Payment for ${booking.serviceSnapshot?.name}\nAmount: ₹${booking.amount?.total}`
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <p className="section-label">Your Account</p>
          <h1 className={styles.title}>My Bookings</h1>
          <p className={styles.sub}>
            Welcome back, {user?.name?.split(" ")[0]}!
          </p>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { label: "Total Bookings", value: stats.total },
            { label: "Upcoming", value: stats.upcoming },
            { label: "Completed", value: stats.completed },
            {
              label: "Loyalty Points",
              value: `${user?.loyaltyPoints || 0} pts`,
            },
          ].map((s) => (
            <div key={s.label} className={`card ${styles.statCard}`}>
              <div className={styles.statVal}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          {["all", "confirmed", "pending", "completed", "cancelled"].map(
            (f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${
                  filter === f ? styles.active : ""
                }`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            )
          )}
          <Link
            to="/book"
            className="btn btn-primary"
            style={{ marginLeft: "auto", padding: "8px 18px", fontSize: 12 }}
          >
            + New Booking
          </Link>
        </div>

        {/* Bookings list */}
        {isLoading ? (
          <div className={styles.loading}>Loading your bookings...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>No bookings found</h3>
            <p>
              {filter === "all"
                ? "You haven't booked anything yet."
                : `No ${filter} bookings.`}
            </p>
            <Link
              to="/book"
              className="btn btn-primary"
              style={{ marginTop: 16 }}
            >
              Book Your First Wash
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((b, i) => (
              <motion.div
                key={b._id}
                className={`card ${styles.bookingCard}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={styles.cardLeft}>
                  <span className={styles.serviceIcon}>
                    {b.serviceSnapshot?.icon || "🚗"}
                  </span>
                  <div>
                    <h3 className={styles.serviceName}>
                      {b.serviceSnapshot?.name}
                    </h3>
                    <p className={styles.vehicleInfo}>
                      {b.vehicle?.make} {b.vehicle?.model} · {b.vehicle?.type}
                    </p>
                    <p className={styles.bookingMeta}>
                      {new Date(b.appointmentDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      &nbsp;·&nbsp; {b.timeSlot?.start} – {b.timeSlot?.end}
                    </p>
                  </div>
                </div>

                {/* <div className={styles.cardRight}>
                  <span className={`badge ${STATUS_COLORS[b.status] || 'badge-blue'}`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  <div className={styles.amount}>₹{b.amount?.total}</div>
                  <div className={styles.bookingId}>{b.bookingId}</div>

                  {['pending','confirmed'].includes(b.status) && (
                    <button className={styles.cancelBtn}
                      onClick={() => setCancelId(b._id)}>
                      Cancel
                    </button>
                  )}
                </div> */}
                <div className={styles.cardRight}>
                  <span
                    className={`badge ${
                      STATUS_COLORS[b.status] || "badge-blue"
                    }`}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>

                  <div className={styles.amount}>₹{b.amount?.total}</div>

                  <div className={styles.bookingId}>{b.bookingId}</div>

                  {b.status === "completed" && (
                    <>
                      <a
                        href={`https://rv-car-studio-api.onrender.com/api/invoice/${b._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.invoiceBtn}
                      >
                        📄 Download Invoice
                      </a>

                      <Link to="/review" className={styles.reviewBtn}>
                        ⭐ Write Review
                      </Link>
                    </>
                  )}

                  {["pending", "confirmed"].includes(b.status) && (
                    <>
                      <button
                        className={styles.payBtn}
                        onClick={() => handlePayment(b)}
                      >
                        💳 Pay Now
                      </button>

                      <button
                        className={styles.cancelBtn}
                        onClick={() => setCancelId(b._id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Cancel confirmation modal */}
        {cancelId && (
          <div className={styles.overlay}>
            <motion.div
              className={`card ${styles.modal}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3>Cancel Booking?</h3>
              <p>
                Are you sure you want to cancel this booking? This cannot be
                undone.
              </p>
              <div className={styles.modalBtns}>
                <button
                  className="btn btn-outline"
                  onClick={() => setCancelId(null)}
                >
                  Keep Booking
                </button>
                <button
                  className="btn btn-primary"
                  style={{ background: "#dc2626" }}
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(cancelId)}
                >
                  {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
