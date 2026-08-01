import { useState, useEffect } from 'react';
import { goalAPI } from '../services/api';

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
  card: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  addRow: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    flex: 1,
    transition: 'all 0.3s ease',
  },
  select: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    width: '112px',
    transition: 'all 0.3s ease',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7)',
    backgroundSize: '200% 200%',
    color: '#0a0a0f',
    fontWeight: 600,
    padding: '10px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'btnGradient 3s ease infinite',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    marginBottom: '12px',
  },
  goalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  goalCard: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  goalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalTitle: {
    fontWeight: 500,
  },
  goalDesc: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  statusBadge: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '9999px',
  },
  progressSection: {
    marginTop: '12px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '4px',
  },
  progressBar: {
    width: '100%',
    background: '#1a1a2e',
    borderRadius: '4px',
    height: '8px',
    overflow: 'hidden',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #4ecca3, #e94560)',
    height: '8px',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
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

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', period: 'daily', emoji: '🎯' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await goalAPI.getGoals();
      setGoals(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addGoal = async () => {
    if (!newGoal.title.trim()) return;
    try {
      const res = await goalAPI.createGoal(newGoal);
      setGoals([res.data, ...goals]);
      setNewGoal({ title: '', period: 'daily', emoji: '🎯' });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>🎯</div></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Goals</h1>

      <div style={styles.card}>
        <div style={styles.addRow}>
          <input style={styles.input} placeholder="Goal title" value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
          <select style={styles.select} value={newGoal.period}
            onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value })}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button onClick={addGoal} style={styles.addBtn}>+ Add</button>
        </div>
      </div>

      <div style={styles.section}>
        {['daily', 'weekly', 'monthly', 'yearly'].map(period => {
          const periodGoals = goals.filter(g => g.period === period);
          if (periodGoals.length === 0) return null;
          return (
            <div key={period}>
              <h2 style={styles.sectionTitle}>{period} Goals</h2>
              <div style={styles.goalList}>
                {periodGoals.map(goal => (
                  <div key={goal.id} style={styles.goalCard}>
                    <div style={styles.goalHeader}>
                      <div>
                        <h3 style={styles.goalTitle}>{goal.emoji} {goal.title}</h3>
                        <p style={styles.goalDesc}>{goal.description}</p>
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        ...(goal.status === 'completed' ? { background: 'rgba(78,204,163,0.2)', color: '#4ecca3' } : { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' })
                      }}>{goal.status}</span>
                    </div>
                    <div style={styles.progressSection}>
                      <div style={styles.progressHeader}>
                        <span>Progress</span>
                        <span>{goal.progress_percentage}%</span>
                      </div>
                      <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: `${goal.progress_percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🎯</p>
            <p style={styles.emptyText}>No goals yet. Set your first goal!</p>
          </div>
        )}
      </div>
    </div>
  );
}