import { useState, useEffect } from 'react';
import { studyAPI } from '../services/api';

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
    flex: 1,
    transition: 'all 0.3s ease',
  },
  numberInput: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    width: '96px',
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
  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  subjectCard: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  subjectEmoji: {
    fontSize: '1.875rem',
    marginBottom: '8px',
  },
  subjectName: {
    fontWeight: 600,
  },
  subjectHours: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  progressBar: {
    width: '100%',
    background: '#1a1a2e',
    borderRadius: '4px',
    height: '6px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: {
    background: '#4ecca3',
    height: '6px',
    borderRadius: '4px',
  },
  sessionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sessionItem: {
    padding: '12px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionName: {
    fontWeight: 500,
  },
  sessionMeta: {
    color: '#6b7280',
    fontSize: '0.875rem',
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

export default function Study() {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', emoji: '📚' });
  const [newSession, setNewSession] = useState({ subject: '', duration_minutes: 60, date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subRes, sesRes] = await Promise.all([studyAPI.getSubjects(), studyAPI.getSessions()]);
      setSubjects(subRes.data);
      setSessions(sesRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addSubject = async () => {
    if (!newSubject.name.trim()) return;
    try {
      const res = await studyAPI.createSubject(newSubject);
      setSubjects([...subjects, res.data]);
      setNewSubject({ name: '', emoji: '📚' });
    } catch (err) { console.error(err); }
  };

  const addSession = async () => {
    if (!newSession.subject) return;
    try {
      const res = await studyAPI.createSession({
        ...newSession,
        start_time: new Date().toTimeString().slice(0, 8),
      });
      setSessions([res.data, ...sessions]);
      loadData();
    } catch (err) { console.error(err); }
  };

  const totalHours = sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60;

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>📚</div></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Study Tracker</h1>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#4ecca3' }}>{subjects.length}</div>
          <div style={styles.statLabel}>Subjects</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#e94560' }}>{totalHours.toFixed(1)}h</div>
          <div style={styles.statLabel}>Total Study</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: '#ffd700' }}>{sessions.length}</div>
          <div style={styles.statLabel}>Sessions</div>
        </div>
      </div>

      {/* Add Subject */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Add Subject</h2>
        <div style={styles.addRow}>
          <input style={styles.input} placeholder="Subject name" value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} />
          <button onClick={addSubject} style={styles.addBtn}>+ Add</button>
        </div>
      </div>

      {/* Subjects */}
      <div style={styles.subjectsGrid}>
        {subjects.map((sub) => (
          <div key={sub.id} style={styles.subjectCard}>
            <div style={styles.subjectEmoji}>{sub.emoji}</div>
            <h3 style={styles.subjectName}>{sub.name}</h3>
            <p style={styles.subjectHours}>{sub.total_hours || 0}h studied</p>
            {sub.progress_percentage > 0 && (
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${sub.progress_percentage}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Log Study Session */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Log Study Session</h2>
        <div style={styles.addRow}>
          <select style={styles.select} value={newSession.subject}
            onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
          </select>
          <input type="number" style={styles.numberInput} placeholder="Minutes" value={newSession.duration_minutes}
            onChange={(e) => setNewSession({ ...newSession, duration_minutes: parseInt(e.target.value) || 0 })} />
          <button onClick={addSession} style={styles.addBtn}>Log</button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h2 style={styles.cardTitle}>Recent Sessions</h2>
        <div style={styles.sessionList}>
          {sessions.slice(0, 10).map((s) => (
            <div key={s.id} style={styles.sessionItem}>
              <div>
                <span style={styles.sessionName}>{s.subject_name}</span>
                <span style={styles.sessionMeta}> {s.topic}</span>
              </div>
              <div style={styles.sessionMeta}>{s.duration_minutes}min • {s.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
