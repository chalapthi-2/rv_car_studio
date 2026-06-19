import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/',        label: 'Home'     },
    { to: '/services', label: 'Services' },
    { to: '/plans',   label: 'Plans'    },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          RV-SPLASH<span>X</span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`${styles.link} ${pathname === l.to ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/my-bookings" className={styles.link} onClick={() => setMenuOpen(false)}>My Bookings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={styles.link} onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <div className={styles.userMenu}>
                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
           // <Link to="/login" className={styles.link} onClick={() => setMenuOpen(false)}>Login</Link>
          )}
          <>
  <Link
    to="/book"
    className={`btn btn-primary ${styles.bookBtn}`}
    onClick={() => setMenuOpen(false)}
  >
    Book Now
  </Link>
</>
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
