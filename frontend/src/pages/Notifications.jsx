import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  markAllBtn: {
    fontSize: '0.875rem',
    color: '#4ecca3',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  notifList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  notifItem: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  notifUnread: {
    borderColor: 'rgba(78,204,163,0.2)',
  },
  notifIcon: {
    fontSize: '1.5rem',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontWeight: 500,
  },
  notifMsg: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  notifDate: {
    fontSize: '0.75rem',
    color: '#4b5563',
    marginTop: '4px',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    background: '#4ecca3',
    borderRadius: '50%',
    marginTop: '8px',
  },
  emptyState: {
    padding: '32px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#6b7280',
  },
  card: {
    padding: '24px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  cardTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '16px',
  },
  prefList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  prefItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'rgba(26,26,46,0.5)',
    borderRadius: '12px',
  },
  prefLabel: {
    fontSize: '0.875rem',
  },
  prefTime: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  toggle: {
    width: '40px',
    height: '24px',
    borderRadius: '9999px',
    transition: 'background 0.3s ease',
    position: 'relative',
  },
  toggleOn: {
    background: '#4ecca3',
  },
  toggleOff: {
    background: '#16213e',
  },
  toggleKnob: {
    width: '16px',
    height: '16px',
    background: 'white',
    borderRadius: '50%',
    marginTop: '4px',
    transition: 'transform 0.3s ease',
  },
  knobOn: {
    transform: 'translateX(20px)',
  },
  knobOff: {
    transform: 'translateX(4px)',
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

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notRes, prefRes] = await Promise.all([
        notificationAPI.getNotifications(),
        notificationAPI.getPreferences()
      ]);
      setNotifications(notRes.data);
      setPreferences(prefRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const togglePreference = async (key) => {
    if (!preferences) return;
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    try {
      const response = await notificationAPI.updatePreferences({ [key]: updated[key] });
      setPreferences(response.data);
    } catch (err) {
      setPreferences(preferences);
      console.error(err);
    }
  };

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>🔔</div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔔 Notifications</h1>
        <button onClick={markAllRead} style={styles.markAllBtn}>Mark all read</button>
      </div>

      <div style={styles.notifList}>
        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🔔</p>
            <p style={styles.emptyText}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} style={{ ...styles.notifItem, ...(!notif.is_read ? styles.notifUnread : {}) }}>
              <span style={styles.notifIcon}>{notif.notification_type?.split('_')[0] || '📌'}</span>
              <div style={styles.notifContent}>
                <p style={styles.notifTitle}>{notif.title}</p>
                <p style={styles.notifMsg}>{notif.message}</p>
                <p style={styles.notifDate}>
                  {new Date(notif.created_at).toLocaleDateString()}
                </p>
              </div>
              {!notif.is_read && <span style={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>

      {/* Preferences */}
      {preferences && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>⚙️ Notification Preferences</h2>
          <div style={styles.prefList}>
            {[
              { key: 'morning_reminder', label: '🌅 Morning Reminder', time: preferences.morning_time },
              { key: 'study_reminder', label: '📚 Study Reminder', time: preferences.study_time },
              { key: 'workout_reminder', label: '🏃 Workout Reminder', time: preferences.workout_time },
              { key: 'expense_reminder', label: '💰 Expense Reminder', time: preferences.expense_time },
              { key: 'sleep_reminder', label: '😴 Sleep Reminder', time: preferences.sleep_time },
            ].map(item => (
              <div key={item.key} style={styles.prefItem}>
                <div>
                  <p style={styles.prefLabel}>{item.label}</p>
                  <p style={styles.prefTime}>{item.time}</p>
                </div>
                <button type="button" aria-label={`Toggle ${item.label}`} onClick={() => togglePreference(item.key)} style={{ ...styles.toggle, border: 'none', cursor: 'pointer', ...(preferences[item.key] ? styles.toggleOn : styles.toggleOff) }}>
                  <div style={{ ...styles.toggleKnob, ...(preferences[item.key] ? styles.knobOn : styles.knobOff) }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
