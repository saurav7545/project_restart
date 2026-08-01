import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  heroCard: {
    padding: '24px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7, #e94560, #ffd700, #4ecca3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 4s ease infinite',
  },
  date: {
    color: '#6b7280',
    marginTop: '4px',
  },
  time: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#06b6d4',
    marginTop: '8px',
    textShadow: '0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(6,182,212,0.2)',
  },
  streakBox: {
    textAlign: 'right',
  },
  streakLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  streakValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e94560',
    textShadow: '0 0 20px rgba(233,69,96,0.5), 0 0 40px rgba(233,69,96,0.2)',
  },
  gradientLine: {
    height: '3px',
    background: 'linear-gradient(90deg, #4ecca3, #06b6d4, #a855f7, #e94560, #ffd700)',
    backgroundSize: '200% 100%',
    animation: 'progressGradient 3s ease infinite',
    borderRadius: '2px',
    marginTop: '16px',
  },
  scoreCard: {
    padding: '24px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  scoreTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '8px',
  },
  scoreValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7, #e94560, #ffd700, #4ecca3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 4s ease infinite',
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginTop: '16px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #4ecca3, #06b6d4, #a855f7, #e94560)',
    backgroundSize: '200% 100%',
    animation: 'progressGradient 3s ease infinite',
    transition: 'width 0.5s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  statCard: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  statIcon: {
    fontSize: '1.5rem',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  quoteCard: {
    padding: '24px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  quoteText: {
    fontSize: '1.125rem',
    fontStyle: 'italic',
    color: '#d1d5db',
  },
  quoteAuthor: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '8px',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '16px',
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  quickLink: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#e0e0e0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  quickIcon: {
    fontSize: '1.875rem',
  },
  quickLabel: {
    fontSize: '0.875rem',
    marginTop: '8px',
  },
  weeklyCard: {
    padding: '24px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  weeklyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  weeklyLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  weeklyValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '256px',
  },
  loadingIcon: {
    fontSize: '2.5rem',
    animation: 'float 3s ease-in-out infinite',
  },
};

// Helper to get time in Asia/Kolkata timezone
const getKolkataTime = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(() => {
    // Load cached data instantly for fast back navigation
    try {
      const cached = sessionStorage.getItem('dashboard_data');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!data);
  const [time, setTime] = useState(getKolkataTime());

  useEffect(() => {
    const timer = setInterval(() => setTime(getKolkataTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Only load if no cached data
    if (!data) {
      loadDashboard();
    } else {
      setLoading(false);
      // Refresh in background
      loadDashboard(true);
    }
  }, []);

  const loadDashboard = async (silent = false) => {
    try {
      const response = await dashboardAPI.getOverview();
      setData(response.data);
      // Cache data for instant back navigation
      sessionStorage.setItem('dashboard_data', JSON.stringify(response.data));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingIcon}>🔄</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Greeting & Time */}
      <div style={styles.heroCard}>
        <div style={styles.heroRow}>
          <div>
            <h1 style={styles.greeting}>
              {data?.greeting || `Good ${time.getHours() < 12 ? 'Morning' : time.getHours() < 17 ? 'Afternoon' : 'Evening'}`} 👋
            </h1>
            <p style={styles.date}>
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p style={styles.time}>
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div style={styles.streakBox}>
            <div style={styles.streakLabel}>🔥 Streak</div>
            <div style={styles.streakValue}>{data?.streak || user?.current_streak || 0} days</div>
          </div>
        </div>
        <div style={styles.gradientLine} />
      </div>

      {/* Life Score */}
      <div style={styles.scoreCard}>
        <h2 style={styles.scoreTitle}>🎯 Today's Life Score</h2>
        <div style={styles.scoreValue}>{data?.today_score || 0}/100</div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${data?.today_score || 0}%` }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(14,165,233,0.08), rgba(99,102,241,0.05))' }}>
          <div style={styles.statIcon}>📚</div>
          <div style={{ ...styles.statValue, color: '#06b6d4', textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>{data?.today_stats?.study_hours || 0}h</div>
          <div style={styles.statLabel}>Study Today</div>
        </div>
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, rgba(78,204,163,0.15), rgba(16,185,129,0.08), rgba(132,204,22,0.05))' }}>
          <div style={styles.statIcon}>✅</div>
          <div style={{ ...styles.statValue, color: '#4ecca3', textShadow: '0 0 20px rgba(78,204,163,0.5)' }}>{data?.today_stats?.todos?.completed || 0}/{data?.today_stats?.todos?.total || 0}</div>
          <div style={styles.statLabel}>Tasks Done</div>
        </div>
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(245,158,11,0.08), rgba(233,69,96,0.05))' }}>
          <div style={styles.statIcon}>🎯</div>
          <div style={{ ...styles.statValue, color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>{data?.today_stats?.habits?.completed || 0}/{data?.today_stats?.habits?.total || 0}</div>
          <div style={styles.statLabel}>Habits Done</div>
        </div>
        <div style={{ ...styles.statCard, background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(139,92,246,0.08), rgba(217,70,239,0.05))' }}>
          <div style={styles.statIcon}>⭐</div>
          <div style={{ ...styles.statValue, color: '#a855f7', textShadow: '0 0 20px rgba(168,85,247,0.5)' }}>{user?.level || 1}</div>
          <div style={styles.statLabel}>Level</div>
        </div>
      </div>

      {/* Quote */}
      {data?.quote && (
        <div style={styles.quoteCard}>
          <p style={styles.quoteText}>"{data.quote.text}"</p>
          <p style={styles.quoteAuthor}>— {data.quote.author}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 style={styles.sectionTitle}>🚀 Quick Actions</h2>
        <div style={styles.quickGrid}>
          <Link to="/planner" style={styles.quickLink}>
            <span style={styles.quickIcon}>📅</span>
            <p style={styles.quickLabel}>Add Task</p>
          </Link>
          <Link to="/study" style={styles.quickLink}>
            <span style={styles.quickIcon}>📚</span>
            <p style={styles.quickLabel}>Study Now</p>
          </Link>
          <Link to="/habits" style={styles.quickLink}>
            <span style={styles.quickIcon}>✅</span>
            <p style={styles.quickLabel}>Log Habits</p>
          </Link>
          <Link to="/expenses" style={styles.quickLink}>
            <span style={styles.quickIcon}>💰</span>
            <p style={styles.quickLabel}>Add Expense</p>
          </Link>
        </div>
      </div>

      {/* Weekly Stats */}
      <div style={styles.weeklyCard}>
        <h2 style={styles.sectionTitle}>📈 Weekly Overview</h2>
        <div style={styles.weeklyGrid}>
          <div>
            <p style={styles.weeklyLabel}>Study Hours</p>
            <p style={styles.weeklyValue}>{data?.weekly_stats?.study_hours || 0}h</p>
          </div>
          <div>
            <p style={styles.weeklyLabel}>XP Earned</p>
            <p style={styles.weeklyValue}>{user?.xp || 0} XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}