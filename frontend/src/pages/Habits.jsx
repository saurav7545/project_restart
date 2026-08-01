import { useState, useEffect } from 'react';
import { habitAPI } from '../services/api';

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
  doneCount: {
    fontSize: '0.875rem',
    color: '#6b7280',
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
  habitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  habitItem: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  habitBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.125rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  habitBtnDone: {
    background: '#4ecca3',
    color: '#0a0a0f',
  },
  habitBtnNotDone: {
    background: '#1a1a2e',
    color: '#6b7280',
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontWeight: 500,
  },
  habitNameDone: {
    textDecoration: 'line-through',
    color: '#6b7280',
  },
  habitStreak: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  habitStats: {
    textAlign: 'right',
    fontSize: '0.75rem',
    color: '#6b7280',
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

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: '', emoji: '✅' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [habRes, logRes] = await Promise.all([habitAPI.getHabits(), habitAPI.getLogs()]);
      setHabits(habRes.data);
      setLogs(logRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addHabit = async () => {
    if (!newHabit.name.trim()) return;
    try {
      const res = await habitAPI.createHabit(newHabit);
      setHabits([...habits, res.data]);
      setNewHabit({ name: '', emoji: '✅' });
    } catch (err) { console.error(err); }
  };

  const toggleHabit = async (habit) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = logs.find(l => l.habit === habit.id && l.date === today);
    try {
      if (existingLog) {
        await habitAPI.updateLog(existingLog.id, { completed: !existingLog.completed });
      } else {
        await habitAPI.createLog({ habit: habit.id, date: today, completed: true });
      }
      loadData();
    } catch (err) { console.error(err); }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === today);
  const completedCount = todayLogs.filter(l => l.completed).length;

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>✅</div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>✅ Habits</h1>
        <div style={styles.doneCount}>{completedCount}/{habits.length} done</div>
      </div>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${habits.length ? (completedCount / habits.length) * 100 : 0}%` }} />
      </div>

      <div style={styles.card}>
        <div style={styles.addRow}>
          <input style={styles.input} placeholder="New habit name" value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()} />
          <button onClick={addHabit} style={styles.addBtn}>+ Add</button>
        </div>
      </div>

      <div style={styles.habitList}>
        {habits.map((habit) => {
          const todayLog = todayLogs.find(l => l.habit === habit.id);
          const isDone = todayLog?.completed;
          return (
            <div key={habit.id} style={styles.habitItem}>
              <button
                onClick={() => toggleHabit(habit)}
                style={{ ...styles.habitBtn, ...(isDone ? styles.habitBtnDone : styles.habitBtnNotDone) }}
              >
                {isDone ? '✓' : habit.emoji}
              </button>
              <div style={styles.habitContent}>
                <p style={isDone ? styles.habitNameDone : styles.habitName}>{habit.emoji} {habit.name}</p>
                <p style={styles.habitStreak}>🔥 {habit.current_streak} day streak</p>
              </div>
              <div style={styles.habitStats}>
                <p>{habit.total_completions} total</p>
                <p>Best: {habit.longest_streak}</p>
              </div>
            </div>
          );
        })}
        {habits.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🧹</p>
            <p style={styles.emptyText}>No habits yet. Add your first habit!</p>
          </div>
        )}
      </div>
    </div>
  );
}