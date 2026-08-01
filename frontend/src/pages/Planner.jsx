import { useState, useEffect } from 'react';
import { plannerAPI } from '../services/api';

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
  subtitle: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginTop: '4px',
  },
  progressBar: {
    width: '100%',
    background: '#1a1a2e',
    borderRadius: '4px',
    height: '8px',
    overflow: 'hidden',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #4ecca3, #06b6d4, #a855f7)',
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
  select: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    width: '128px',
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
    whiteSpace: 'nowrap',
    animation: 'btnGradient 3s ease infinite',
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  todoItem: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s ease',
  },
  todoItemDone: {
    opacity: 0.5,
  },
  checkbox: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid #6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    background: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#0a0a0f',
  },
  checkboxDone: {
    background: '#4ecca3',
    borderColor: '#4ecca3',
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: '0.875rem',
  },
  todoTitleDone: {
    textDecoration: 'line-through',
    color: '#6b7280',
  },
  todoTime: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  priorityBadge: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '9999px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
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

export default function Planner() {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', priority: 'medium', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todosRes, catsRes] = await Promise.all([
        plannerAPI.getTodos(),
        plannerAPI.getCategories(),
      ]);
      setTodos(todosRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error('Failed to load planner data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    try {
      const res = await plannerAPI.createTodo(newTodo);
      setTodos([res.data, ...todos]);
      setNewTodo({ title: '', priority: 'medium', date: new Date().toISOString().split('T')[0] });
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const res = await plannerAPI.updateTodo(todo.id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === todo.id ? res.data : t));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await plannerAPI.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const todayTodos = todos.filter(t => t.date === new Date().toISOString().split('T')[0]);
  const completed = todayTodos.filter(t => t.completed).length;

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>📅</div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📅 Daily Planner</h1>
          <p style={styles.subtitle}>{completed}/{todayTodos.length} tasks completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${todayTodos.length ? (completed / todayTodos.length) * 100 : 0}%` }} />
      </div>

      {/* Add Todo */}
      <div style={styles.card}>
        <div style={styles.addRow}>
          <input
            type="text"
            style={styles.input}
            placeholder="What do you need to do?"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <select style={styles.select} value={newTodo.priority}
            onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <button onClick={addTodo} style={styles.addBtn}>+ Add</button>
        </div>
      </div>

      {/* Todo List */}
      <div style={styles.todoList}>
        {todayTodos.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🎉</p>
            <p style={styles.emptyText}>No tasks for today. Add one above!</p>
          </div>
        ) : (
          todayTodos.map((todo) => (
            <div key={todo.id} style={{ ...styles.todoItem, ...(todo.completed ? styles.todoItemDone : {}) }}>
              <button
                onClick={() => toggleTodo(todo)}
                style={{ ...styles.checkbox, ...(todo.completed ? styles.checkboxDone : {}) }}
              >
                {todo.completed && '✓'}
              </button>
              <div style={styles.todoContent}>
                <p style={todo.completed ? styles.todoTitleDone : styles.todoTitle}>
                  {todo.emoji} {todo.title}
                </p>
                {todo.time && <p style={styles.todoTime}>⏰ {todo.time}</p>}
              </div>
              <span style={{
                ...styles.priorityBadge,
                ...(todo.priority === 'high' ? { background: 'rgba(233,69,96,0.2)', color: '#f87171' } :
                  todo.priority === 'medium' ? { background: 'rgba(245,158,11,0.2)', color: '#fbbf24' } :
                  { background: 'rgba(78,204,163,0.2)', color: '#4ecca3' })
              }}>
                {todo.priority}
              </span>
              <button onClick={() => deleteTodo(todo.id)} style={styles.deleteBtn}>🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}