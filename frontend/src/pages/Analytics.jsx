import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4ecca3', '#e94560', '#ffd700', '#0f3460', '#ff6b6b', '#95e1d3'];

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
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    padding: '32px 0',
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

const tooltipStyle = {
  background: '#1a1a2e',
  border: '1px solid #333',
  borderRadius: '8px',
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await analyticsAPI.getData();
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>📊</div></div>;

  const studyData = data?.study?.map(s => ({
    date: s.date?.slice(5),
    hours: (s.hours / 60).toFixed(1)
  })) || [];

  const expenseData = data?.expenses?.map(e => ({
    date: e.date?.slice(5),
    amount: parseFloat(e.total)
  })) || [];

  const scoreData = data?.scores?.map(s => ({
    date: s.date?.slice(5),
    score: s.score
  })) || [];

  const habitData = data?.habits ? [
    { name: 'Completed', value: data.habits.completed },
    { name: 'Remaining', value: data.habits.total - data.habits.completed }
  ] : [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Analytics</h1>

      {/* Study Hours Chart */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📚 Study Hours (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={studyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="hours" fill="#4ecca3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Scores */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🎯 Daily Scores (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={scoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="score" stroke="#e94560" strokeWidth={2} dot={{ fill: '#e94560' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Habits & Expenses */}
      <div style={styles.chartGrid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>✅ Habit Completion</h2>
          {habitData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={habitData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                  {habitData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={styles.emptyText}>No habit data yet</p>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>💰 Expenses (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="amount" fill="#e94560" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}