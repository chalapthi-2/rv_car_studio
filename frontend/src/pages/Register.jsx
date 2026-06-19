import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return false; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { toast.error('Enter a valid email'); return false; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Enter a valid 10-digit mobile number'); return false; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to SplashX, ${user.name.split(' ')[0]}! 🚗`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <h1>SPLASH<span>X</span></h1>
          <p>Premium Car Wash Studio</p>
        </div>
        <div className={styles.taglines}>
          <div className={styles.tagline}>🚗 Join 4,800+ happy customers</div>
          <div className={styles.tagline}>📅 Easy online booking</div>
          <div className={styles.tagline}>🎁 50 points on first booking</div>
          <div className={styles.tagline}>🔔 SMS & email reminders</div>
        </div>
      </div>

      <div className={styles.right}>
        <motion.div className={styles.card}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}>

          <h2 className={styles.formTitle}>Create Account</h2>
          <p className={styles.formSub}>Join SplashX and keep your car spotless</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input type="text" placeholder="Ravi Kumar"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Mobile Number</label>
              <input type="tel" placeholder="9876543210"
                value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.passWrap}>
                <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" className={styles.passToggle} onClick={() => setShowPass(p => !p)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className={styles.switchLink}>
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
