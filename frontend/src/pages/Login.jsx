import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '288px',
    height: '288px',
    background: 'rgba(78,204,163,0.2)',
    borderRadius: '50%',
    filter: 'blur(72px)',
    animation: 'float 3s ease-in-out infinite',
  },
  blob2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '288px',
    height: '288px',
    background: 'rgba(168,85,247,0.2)',
    borderRadius: '50%',
    filter: 'blur(72px)',
    animation: 'float 3s ease-in-out infinite',
    animationDelay: '1s',
  },
  blob3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '384px',
    height: '384px',
    background: 'rgba(233,69,96,0.1)',
    borderRadius: '50%',
    filter: 'blur(96px)',
    animation: 'float 3s ease-in-out infinite',
    animationDelay: '2s',
  },
  wrapper: {
    width: '100%',
    maxWidth: '448px',
    position: 'relative',
    zIndex: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  logo: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'inline-block',
    animation: 'float 3s ease-in-out infinite',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    marginTop: '16px',
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7, #e94560, #ffd700, #4ecca3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 4s ease infinite',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '8px',
  },
  card: {
    padding: '32px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    animation: 'slideUp 0.5s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7, #e94560, #ffd700, #4ecca3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 4s ease infinite',
  },
  errorBox: {
    background: 'rgba(233,69,96,0.1)',
    border: '1px solid rgba(233,69,96,0.2)',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '16px',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
  input: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    width: '100%',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7)',
    backgroundSize: '200% 200%',
    color: '#0a0a0f',
    fontWeight: 600,
    padding: '10px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    animation: 'btnGradient 3s ease infinite',
    fontSize: '0.875rem',
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '24px',
  },
  link: {
    color: '#4ecca3',
    textDecoration: 'none',
  },
};

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Colorful background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.wrapper}>
        <div style={styles.header}>
          <img src="/src/assets/appicon.png" alt="Logo" style={styles.logo} />
          <h1 style={styles.title}>Project Restart</h1>
          <p style={styles.subtitle}>Restart Yourself. One Day at a Time.</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Welcome Back</h2>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}