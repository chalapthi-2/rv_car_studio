import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <h1>RV-SPLASH<span>X</span></h1>
          <p>Premium Car Wash Studio</p>
        </div>
        <div className={styles.taglines}>
          <div className={styles.tagline}>🚿 Book slots in seconds</div>
          <div className={styles.tagline}>✨ Track your car's history</div>
          <div className={styles.tagline}>🛡️ Earn loyalty points</div>
          <div className={styles.tagline}>📱 Get booking confirmations</div>
        </div>
      </div>

      <div className={styles.right}>
        <motion.div className={styles.card}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}>

          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSub}>Sign in to your SplashX account</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.passWrap}>
                <input type={showPass ? 'text' : 'password'} placeholder="Your password"
                  value={form.password} onChange={e => set('password', e.target.value)} autoComplete="current-password" />
                <button type="button" className={styles.passToggle} onClick={() => setShowPass(p => !p)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className={styles.demo}>
            <p>Demo credentials:</p>
            <button onClick={() => setForm({ email: 'admin@splashx.in', password: 'admin@123' })}>
              Admin: admin@splashx.in
            </button>
            <button onClick={() => setForm({ email: 'ravi@example.com', password: 'password123' })}>
              Customer: ravi@example.com
            </button>
          </div>

          <p className={styles.switchLink}>
            Don't have an account? <Link to="/register">Create one →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
