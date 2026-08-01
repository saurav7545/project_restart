import { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';

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
    gridTemplateColumns: 'repeat(4, 1fr)',
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
  statLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
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
    flexWrap: 'wrap',
  },
  input: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    flex: 1,
    minWidth: '150px',
    transition: 'all 0.3s ease',
  },
  amountInput: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    width: '96px',
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
  dateInput: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    width: '140px',
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
  incomeBtn: {
    background: 'linear-gradient(135deg, #4ecca3, #10b981, #84cc16)',
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
  listTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '12px',
  },
  expenseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  expenseItem: {
    padding: '12px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  expenseName: {
    fontWeight: 500,
  },
  expenseCat: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginLeft: '8px',
  },
  expenseAmount: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#e94560',
  },
  incomeAmount: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#4ecca3',
  },
  expenseNote: {
    color: '#6b7280',
    fontSize: '0.75rem',
    marginTop: '4px',
  },
  expenseDate: {
    color: '#6b7280',
    fontSize: '0.75rem',
  },
  actionBtns: {
    display: 'flex',
    gap: '6px',
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '6px 10px',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease',
  },
  deleteBtn: {
    background: 'rgba(233,69,96,0.1)',
    border: '1px solid rgba(233,69,96,0.3)',
    borderRadius: '8px',
    padding: '6px 10px',
    color: '#e94560',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease',
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  monthSelect: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '10px 14px',
    color: '#e0e0e0',
    width: '160px',
  },
  viewAllBtn: {
    background: 'none',
    border: '1px solid rgba(99,230,190,0.3)',
    borderRadius: '10px',
    padding: '8px 16px',
    color: '#63e6be',
    cursor: 'pointer',
    fontSize: '0.8rem',
    marginTop: '12px',
    transition: 'all 0.2s ease',
  },
  budgetRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  budgetBar: {
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginTop: '6px',
  },
  budgetFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },
  budgetLabel: {
    fontSize: '0.8rem',
    color: '#d5d8df',
  },
  budgetAmount: {
    fontSize: '0.8rem',
    color: '#8a91a1',
  },
  savingsCard: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(245,158,11,0.05))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,215,0,0.2)',
  },
  savingsValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffd700',
  },
  savingsGoal: {
    fontSize: '0.8rem',
    color: '#8a91a1',
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #ffd700, #f59e0b, #f97316)',
    transition: 'width 0.4s ease',
  },
  breakdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  breakdownEmoji: {
    fontSize: '1.1rem',
  },
  breakdownName: {
    flex: 1,
    fontSize: '0.85rem',
  },
  breakdownAmount: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#e94560',
  },
  breakdownPct: {
    fontSize: '0.75rem',
    color: '#8a91a1',
    width: '48px',
    textAlign: 'right',
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
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  editForm: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4)',
    color: '#0a0a0f',
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    padding: '8px 16px',
    color: '#9ca3af',
    cursor: 'pointer',
  },
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savings, setSavings] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], note: '' });
  const [newIncome, setNewIncome] = useState({ source: '', amount: '', date: new Date().toISOString().split('T')[0], note: '' });
  const [newSavings, setNewSavings] = useState({ month: new Date().toISOString().split('T')[0].slice(0, 7) + '-01', amount: '', goal: '' });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', amount: '', category: '', note: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [expRes, incRes, catRes, savRes] = await Promise.all([
        expenseAPI.getExpenses(), expenseAPI.getIncomes(), expenseAPI.getCategories(), expenseAPI.getSavings()
      ]);
      setExpenses(expRes.data);
      setIncomes(incRes.data);
      setCategories(catRes.data);
      setSavings(savRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addExpense = async () => {
    if (!newExpense.title || !newExpense.amount) return;
    try {
      const res = await expenseAPI.createExpense(newExpense);
      setExpenses([res.data, ...expenses]);
      setNewExpense({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], note: '' });
    } catch (err) { console.error(err); }
  };

  const addIncome = async () => {
    if (!newIncome.source || !newIncome.amount) return;
    try {
      const res = await expenseAPI.createIncome(newIncome);
      setIncomes([res.data, ...incomes]);
      setNewIncome({ source: '', amount: '', date: new Date().toISOString().split('T')[0], note: '' });
    } catch (err) { console.error(err); }
  };

  const addSavings = async () => {
    if (!newSavings.amount) return;
    try {
      const res = await expenseAPI.createSavings(newSavings);
      setSavings([res.data, ...savings]);
      setNewSavings({ month: new Date().toISOString().split('T')[0].slice(0, 7) + '-01', amount: '', goal: '' });
    } catch (err) { console.error(err); }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseAPI.deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) { console.error(err); }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({ title: expense.title, amount: expense.amount, category: expense.category || '', note: expense.note || '' });
  };

  const saveEdit = async () => {
    try {
      const res = await expenseAPI.updateExpense(editingId, editForm);
      setExpenses(expenses.map(e => e.id === editingId ? res.data : e));
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  // Filter expenses by selected month
  const filteredExpenses = expenses.filter(e => (e.date || '').startsWith(selectedMonth));
  const filteredIncomes = incomes.filter(i => (i.date || '').startsWith(selectedMonth));

  const totalExpense = filteredExpenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const totalIncome = filteredIncomes.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const totalSavings = savings.reduce((s, sv) => s + parseFloat(sv.amount || 0), 0);

  // Category breakdown
  const categoryBreakdown = categories.map(cat => {
    const spent = filteredExpenses.filter(e => e.category === cat.id).reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    return { ...cat, spent };
  }).filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent);

  const maxCategorySpend = Math.max(...categoryBreakdown.map(c => c.spent), 1);

  // Budget tracking
  const budgetCategories = categories.filter(c => parseFloat(c.budget || 0) > 0);

  // Current month savings
  const currentMonthSavings = savings.find(s => (s.month || '').startsWith(selectedMonth));
  const savingsAmount = currentMonthSavings ? parseFloat(currentMonthSavings.amount || 0) : 0;
  const savingsGoal = currentMonthSavings ? parseFloat(currentMonthSavings.goal || 0) : 0;
  const savingsPct = savingsGoal > 0 ? Math.min(100, (savingsAmount / savingsGoal) * 100) : 0;

  const visibleExpenses = showAll ? filteredExpenses : filteredExpenses.slice(0, 10);

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>💰</div></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 Money Tracker</h1>

      {/* Month Filter */}
      <div style={styles.card}>
        <div style={styles.filterRow}>
          <label style={{ fontSize: '0.8rem', color: '#8a91a1' }}>📅 Month:</label>
          <input
            type="month"
            style={styles.monthSelect}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Income</div>
          <div style={{ ...styles.statValue, color: '#4ecca3' }}>₹{totalIncome.toFixed(0)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Expenses</div>
          <div style={{ ...styles.statValue, color: '#e94560' }}>₹{totalExpense.toFixed(0)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Balance</div>
          <div style={{ ...styles.statValue, color: '#ffd700' }}>₹{(totalIncome - totalExpense).toFixed(0)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Savings</div>
          <div style={{ ...styles.statValue, color: '#a855f7' }}>₹{totalSavings.toFixed(0)}</div>
        </div>
      </div>

      {/* Add Expense + Add Income */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>➕ Add Expense</h2>
          <div style={styles.addRow}>
            <input style={styles.input} placeholder="Title" value={newExpense.title}
              onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} />
            <input type="number" style={styles.amountInput} placeholder="₹" value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
            <select style={styles.select} value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}>
              <option value="">Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
            <input type="date" style={styles.dateInput} value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
            <input style={styles.input} placeholder="Note (optional)" value={newExpense.note}
              onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })} />
            <button onClick={addExpense} style={styles.addBtn}>+ Add</button>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>💵 Add Income</h2>
          <div style={styles.addRow}>
            <input style={styles.input} placeholder="Source (e.g. Salary)" value={newIncome.source}
              onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })} />
            <input type="number" style={styles.amountInput} placeholder="₹" value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })} />
            <input type="date" style={styles.dateInput} value={newIncome.date}
              onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })} />
            <button onClick={addIncome} style={styles.incomeBtn}>+ Add</button>
          </div>
        </div>
      </div>

      {/* Savings Tracker */}
      <div style={styles.savingsCard}>
        <h2 style={styles.cardTitle}>🎯 Monthly Savings Goal</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={styles.savingsValue}>₹{savingsAmount.toFixed(0)}</div>
            <div style={styles.savingsGoal}>Goal: ₹{savingsGoal.toFixed(0)}</div>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${savingsPct}%` }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8a91a1', marginTop: '4px' }}>
              {savingsPct.toFixed(0)}% of goal achieved
            </div>
          </div>
          <div style={styles.addRow}>
            <input type="number" style={styles.amountInput} placeholder="Amount" value={newSavings.amount}
              onChange={(e) => setNewSavings({ ...newSavings, amount: e.target.value })} />
            <input type="number" style={styles.amountInput} placeholder="Goal" value={newSavings.goal}
              onChange={(e) => setNewSavings({ ...newSavings, goal: e.target.value })} />
            <button onClick={addSavings} style={styles.addBtn}>Save</button>
          </div>
        </div>
      </div>

      {/* Category Budget Tracking */}
      {budgetCategories.length > 0 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Category Budgets</h2>
          {budgetCategories.map(cat => {
            const spent = filteredExpenses.filter(e => e.category === cat.id).reduce((s, e) => s + parseFloat(e.amount || 0), 0);
            const budget = parseFloat(cat.budget || 0);
            const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
            const over = spent > budget;
            return (
              <div key={cat.id}>
                <div style={styles.budgetRow}>
                  <span style={styles.budgetLabel}>{cat.emoji} {cat.name}</span>
                  <span style={styles.budgetAmount}>
                    ₹{spent.toFixed(0)} / ₹{budget.toFixed(0)} {over && <span style={{ color: '#e94560' }}>⚠️ Over</span>}
                  </span>
                </div>
                <div style={styles.budgetBar}>
                  <div style={{
                    ...styles.budgetFill,
                    width: `${pct}%`,
                    background: over ? 'linear-gradient(90deg, #e94560, #f43f5e)' : 'linear-gradient(90deg, #4ecca3, #06b6d4)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🍩 Spending Breakdown</h2>
          {categoryBreakdown.map(cat => (
            <div key={cat.id} style={styles.breakdownItem}>
              <span style={styles.breakdownEmoji}>{cat.emoji}</span>
              <span style={styles.breakdownName}>{cat.name}</span>
              <div style={{ flex: 1, maxWidth: '200px' }}>
                <div style={styles.budgetBar}>
                  <div style={{
                    ...styles.budgetFill,
                    width: `${(cat.spent / maxCategorySpend) * 100}%`,
                    background: 'linear-gradient(90deg, #e94560, #f97316)',
                  }} />
                </div>
              </div>
              <span style={styles.breakdownAmount}>₹{cat.spent.toFixed(0)}</span>
              <span style={styles.breakdownPct}>{totalExpense > 0 ? ((cat.spent / totalExpense) * 100).toFixed(0) : 0}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Expenses */}
      <div>
        <h2 style={styles.listTitle}>Recent Expenses {!showAll && filteredExpenses.length > 10 && `(${filteredExpenses.length})`}</h2>
        <div style={styles.expenseList}>
          {visibleExpenses.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No expenses for this month yet.</p>}
          {visibleExpenses.map((e) => (
            <div key={e.id} style={styles.expenseItem}>
              {editingId === e.id ? (
                <div style={styles.editForm}>
                  <input style={{ ...styles.input, minWidth: '100px', flex: 1 }} value={editForm.title}
                    onChange={(ev) => setEditForm({ ...editForm, title: ev.target.value })} />
                  <input type="number" style={styles.amountInput} value={editForm.amount}
                    onChange={(ev) => setEditForm({ ...editForm, amount: ev.target.value })} />
                  <select style={styles.select} value={editForm.category}
                    onChange={(ev) => setEditForm({ ...editForm, category: ev.target.value })}>
                    <option value="">Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                  </select>
                  <button onClick={saveEdit} style={styles.saveBtn}>Save</button>
                  <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div>
                      <span style={styles.expenseName}>{e.title}</span>
                      <span style={styles.expenseCat}>{e.category_name}</span>
                    </div>
                    <div style={styles.expenseDate}>{e.date}</div>
                    {e.note && <div style={styles.expenseNote}>📝 {e.note}</div>}
                  </div>
                  <div style={styles.expenseAmount}>-₹{e.amount}</div>
                  <div style={styles.actionBtns}>
                    <button style={styles.iconBtn} onClick={() => startEdit(e)}>✏️</button>
                    <button style={styles.deleteBtn} onClick={() => deleteExpense(e.id)}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {filteredExpenses.length > 10 && (
          <button style={styles.viewAllBtn} onClick={() => setShowAll(!showAll)}>
            {showAll ? '▲ Show Less' : `▼ View All (${filteredExpenses.length})`}
          </button>
        )}
      </div>

      {/* Recent Income */}
      <div>
        <h2 style={styles.listTitle}>Recent Income</h2>
        <div style={styles.expenseList}>
          {filteredIncomes.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No income for this month yet.</p>}
          {filteredIncomes.slice(0, 5).map((i) => (
            <div key={i.id} style={styles.expenseItem}>
              <div style={{ flex: 1 }}>
                <span style={styles.expenseName}>{i.source}</span>
                <div style={styles.expenseDate}>{i.date}</div>
                {i.note && <div style={styles.expenseNote}>📝 {i.note}</div>}
              </div>
              <div style={styles.incomeAmount}>+₹{i.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}