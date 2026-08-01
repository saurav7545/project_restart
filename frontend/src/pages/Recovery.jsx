import { useState, useEffect } from 'react';
import { recoveryAPI } from '../services/api';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  statCard: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  card: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  cardTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '12px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  input: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    width: '100%',
    marginTop: '4px',
    transition: 'all 0.3s ease',
  },
  triggerSection: {
    marginTop: '12px',
  },
  checkboxRow: {
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7)',
    backgroundSize: '200% 200%',
    color: '#0a0a0f',
    fontWeight: 600,
    padding: '10px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px',
    animation: 'btnGradient 3s ease infinite',
  },
  listTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '12px',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  logItem: {
    padding: '12px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logStatus: {
    fontWeight: 500,
  },
  logMeta: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginLeft: '8px',
  },
  logDate: {
    fontSize: '0.875rem',
    color: '#9ca3af',
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

export default function Recovery() {
  const [logs, setLogs] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    porn_count: 0, masturbation_count: 0, urge_level: 0, clean_day: true,
    mood: '😊', trigger: '', notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logRes, milRes] = await Promise.all([recoveryAPI.getLogs(), recoveryAPI.getMilestones()]);
      setLogs(logRes.data);
      setMilestones(milRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const saveLog = async () => {
    try {
      const existingLog = logs.find((log) => log.date === form.date);
      if (existingLog) {
        await recoveryAPI.updateLog(existingLog.id, form);
      } else {
        await recoveryAPI.createLog(form);
      }
      loadData();
    } catch (err) { console.error(err); }
  };

  const cleanDays = logs.filter(l => l.clean_day).length;
  const longestStreak = milestones.length > 0 ? Math.max(...milestones.map(m => m.days_clean)) : 0;

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>🔥</div></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔥 Recovery Tracker</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#4ecca3' }}>{cleanDays}</div>
          <div style={styles.statLabel}>Clean Days</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#e94560' }}>{logs.length - cleanDays}</div>
          <div style={styles.statLabel}>Relapses</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#ffd700' }}>{longestStreak}</div>
          <div style={styles.statLabel}>Best Streak</div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Log Today</h2>
        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Porn Count</label>
            <input type="number" style={styles.input} value={form.porn_count}
              onChange={(e) => setForm({ ...form, porn_count: parseInt(e.target.value) || 0 })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Masturbation</label>
            <input type="number" style={styles.input} value={form.masturbation_count}
              onChange={(e) => setForm({ ...form, masturbation_count: parseInt(e.target.value) || 0 })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Urge Level (1-10)</label>
            <input type="number" style={styles.input} min="0" max="10" value={form.urge_level}
              onChange={(e) => setForm({ ...form, urge_level: parseInt(e.target.value) || 0 })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mood</label>
            <select style={styles.input} value={form.mood}
              onChange={(e) => setForm({ ...form, mood: e.target.value })}>
              <option value="😊">😊 Happy</option>
              <option value="😐">😐 Neutral</option>
              <option value="😢">😢 Sad</option>
              <option value="😡">😡 Angry</option>
              <option value="😴">😴 Tired</option>
            </select>
          </div>
        </div>
        <div style={styles.triggerSection}>
          <label style={styles.label}>Trigger</label>
          <select style={styles.input} value={form.trigger}
            onChange={(e) => setForm({ ...form, trigger: e.target.value })}>
            <option value="">None</option>
            <option value="phone">📱 Phone</option>
            <option value="stress">😰 Stress</option>
            <option value="loneliness">😔 Loneliness</option>
            <option value="instagram">📸 Instagram</option>
            <option value="boredom">😴 Boredom</option>
          </select>
        </div>
        <div style={styles.checkboxRow}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={form.clean_day}
              onChange={(e) => setForm({ ...form, clean_day: e.target.checked })} />
            <span>Clean Day</span>
          </label>
        </div>
        <button onClick={saveLog} style={styles.saveBtn}>Save Log</button>
      </div>

      <div>
        <h2 style={styles.listTitle}>Recent Logs</h2>
        <div style={styles.logList}>
          {logs.slice(0, 7).map((log) => (
            <div key={log.id} style={styles.logItem}>
              <div>
                <span style={{ ...styles.logStatus, color: log.clean_day ? '#4ecca3' : '#e94560' }}>
                  {log.clean_day ? '✅ Clean' : '❌ Relapse'}
                </span>
                <span style={styles.logMeta}>Urge: {log.urge_level}/10</span>
              </div>
              <div style={styles.logDate}>{log.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
