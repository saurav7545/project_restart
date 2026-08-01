import { useState, useEffect } from 'react';
import { fitnessAPI } from '../services/api';

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
  },
  statIcon: {
    fontSize: '1.5rem',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '1.125rem',
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

export default function Fitness() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '', water_glasses: 0, sleep_hours: 0, workout_minutes: 0, steps: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fitnessAPI.getLogs();
      setLogs(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const saveLog = async () => {
    try {
      const existingLog = logs.find((log) => log.date === form.date);
      const res = existingLog
        ? await fitnessAPI.updateLog(existingLog.id, form)
        : await fitnessAPI.createLog(form);
      setLogs((current) => existingLog
        ? current.map((log) => log.id === existingLog.id ? res.data : log)
        : [res.data, ...current]);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>🏃</div></div>;

  const today = logs.find(l => l.date === new Date().toISOString().split('T')[0]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏃 Fitness Tracker</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚖️</div>
          <div style={styles.statValue}>{today?.weight || '-'} kg</div>
          <div style={styles.statLabel}>Weight</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💧</div>
          <div style={styles.statValue}>{today?.water_glasses || 0}</div>
          <div style={styles.statLabel}>Water</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>😴</div>
          <div style={styles.statValue}>{today?.sleep_hours || 0}h</div>
          <div style={styles.statLabel}>Sleep</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏋️</div>
          <div style={styles.statValue}>{today?.workout_minutes || 0}min</div>
          <div style={styles.statLabel}>Workout</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👣</div>
          <div style={styles.statValue}>{today?.steps || 0}</div>
          <div style={styles.statLabel}>Steps</div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Log Today's Fitness</h2>
        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Weight (kg)</label>
            <input type="number" style={styles.input} value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Water (glasses)</label>
            <input type="number" style={styles.input} value={form.water_glasses}
              onChange={(e) => setForm({ ...form, water_glasses: parseInt(e.target.value) || 0 })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Sleep (hours)</label>
            <input type="number" style={styles.input} value={form.sleep_hours}
              onChange={(e) => setForm({ ...form, sleep_hours: parseFloat(e.target.value) || 0 })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Workout (min)</label>
            <input type="number" style={styles.input} value={form.workout_minutes}
              onChange={(e) => setForm({ ...form, workout_minutes: parseInt(e.target.value) || 0 })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Steps</label>
            <input type="number" style={styles.input} value={form.steps}
              onChange={(e) => setForm({ ...form, steps: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <button onClick={saveLog} style={styles.saveBtn}>Save Log</button>
      </div>
    </div>
  );
}
