import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/planner', label: 'Planner', icon: '📅' },
  { path: '/study', label: 'Study', icon: '📚' },
  { path: '/projects', label: 'Projects', icon: '💻' },
  { path: '/expenses', label: 'Expenses', icon: '💰' },
  { path: '/fitness', label: 'Fitness', icon: '🏃' },
  { path: '/habits', label: 'Habits', icon: '✅' },
  { path: '/recovery', label: 'Recovery', icon: '🔥' },
  { path: '/goals', label: 'Goals', icon: '🎯' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/ai', label: 'AI Coach', icon: '🤖' },
];

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    background: '#0a0a0f',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 50,
    width: '256px',
    background: '#12121a',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    overflowY: 'auto',
  },
  sidebarOpen: {
    transform: 'translateX(0)',
  },
  sidebarDesktop: {
    position: 'static',
    transform: 'translateX(0)',
  },
  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px',
  },
  brandIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
  },
  brandTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7, #e94560, #ffd700, #4ecca3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 4s ease infinite',
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginLeft: '4px',
  },
  userCard: {
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4ecca3, #a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#0a0a0f',
  },
  username: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  userMeta: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  nav: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '12px',
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: '#9ca3af',
    transition: 'all 0.3s ease',
  },
  navLinkHover: {
    background: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
  },
  navLinkActive: {
    background: 'linear-gradient(135deg, rgba(78,204,163,0.15), rgba(6,182,212,0.1), rgba(168,85,247,0.1))',
    border: '1px solid rgba(78,204,163,0.3)',
    color: '#4ecca3',
    boxShadow: '0 0 20px rgba(78,204,163,0.1)',
  },
  navIcon: {
    fontSize: '1.125rem',
  },
  logoutSection: {
    padding: '12px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    marginTop: 'auto',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '12px',
    fontSize: '0.875rem',
    color: '#9ca3af',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.3s ease',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 40,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  header: {
    height: '64px',
    background: 'rgba(18,18,26,0.8)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#9ca3af',
    cursor: 'pointer',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginLeft: 'auto',
  },
  notifLink: {
    position: 'relative',
    fontSize: '1.25rem',
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  notifBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '16px',
    height: '16px',
    background: '#e94560',
    borderRadius: '50%',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  streak: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
  },
};

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarStyle = {
    ...styles.sidebar,
    ...(sidebarOpen ? styles.sidebarOpen : {}),
  };

  return (
    <div style={styles.layout} className="app-layout">
      {/* Sidebar */}
      <aside style={sidebarStyle} className="sidebar-desktop">
        <div style={styles.sidebarHeader}>
          <div style={styles.brandRow}>
            <img src="/restart-icon.svg" alt="Project Restart" style={styles.brandIcon} />
            <h1 style={styles.brandTitle}>Project Restart</h1>
          </div>
          <p style={styles.brandSubtitle}>Restart Yourself. One Day at a Time.</p>
        </div>

        {user && (
          <div style={styles.userCard}>
            <div style={styles.userRow}>
              <div style={styles.avatar}>
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p style={styles.username}>{user.username}</p>
                <p style={styles.userMeta}>Level {user.level} • {user.xp} XP</p>
              </div>
            </div>
          </div>
        )}

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={{
                ...styles.navLink,
                ...(location.pathname === item.path ? styles.navLinkActive : {}),
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={styles.logoutSection}>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(233,69,96,0.1)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div style={styles.main} className="app-main">
        {/* Top Bar */}
        <header style={styles.header} className="app-header">
          <button
            onClick={() => setSidebarOpen(true)}
            style={styles.menuBtn}
          >
            ☰
          </button>
          <div style={styles.headerRight}>
            <Link to="/notifications" style={styles.notifLink}>
              🔔
              <span style={styles.notifBadge}>3</span>
            </Link>
            <div style={styles.streak}>
              <span>🔥</span>
              <span>{user?.current_streak || 0} day streak</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={styles.content} className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
