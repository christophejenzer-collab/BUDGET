import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchTransactions();
    fetchSavingsGoals();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/transactions`);
      const data = await res.json();
      setTransactions(data);
      calculateSummary(data);
    } catch (error) {
      console.error('Fehler beim Laden der Transaktionen:', error);
    }
  };

  const fetchSavingsGoals = async () => {
    try {
      const res = await fetch(`${API_URL}/savings-goals`);
      const data = await res.json();
      setSavingsGoals(data);
    } catch (error) {
      console.error('Fehler beim Laden der Sparziele:', error);
    }
  };

  const calculateSummary = (txns) => {
    let income = 0;
    let expense = 0;

    txns.forEach(txn => {
      const amount = Number(txn.amount) || 0;
      if (txn.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });

    setIncomeTotal(income);
    setExpenseTotal(expense);
    setBalance(income - expense);
  };

  const addTransaction = async (transaction) => {
    try {
      await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
      fetchTransactions();
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Transaktion:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE'
      });
      fetchTransactions();
    } catch (error) {
      console.error('Fehler beim Löschen der Transaktion:', error);
    }
  };

  const addSavingsGoal = async (goal) => {
    try {
      await fetch(`${API_URL}/savings-goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      });
      fetchSavingsGoals();
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Sparziels:', error);
    }
  };

  const updateSavingsGoal = async (id, amount) => {
    try {
      await fetch(`${API_URL}/savings-goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentAmount: amount })
      });
      fetchSavingsGoals();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Sparziels:', error);
    }
  };

  const deleteSavingsGoal = async (id) => {
    try {
      await fetch(`${API_URL}/savings-goals/${id}`, {
        method: 'DELETE'
      });
      fetchSavingsGoals();
    } catch (error) {
      console.error('Fehler beim Löschen des Sparziels:', error);
    }
  };

  // Letzte 10 Transaktionen mit Filter
  const lastTenTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  const filteredTransactions = lastTenTransactions.filter(txn => {
    const text = (txn.text || txn.description || txn.name || '').toLowerCase();
    const matchesSearch = text.includes(searchTerm.trim().toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={styles.dashboard}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>💰 Budget Tracker</h1>

        <div style={styles.summary}>
          <div style={{...styles.summaryCard, ...styles.income}}>
            <span style={styles.summaryLabel}>📈 Einnahmen</span>
            <strong style={styles.summaryAmount}>CHF {incomeTotal.toFixed(2)}</strong>
          </div>

          <div style={{...styles.summaryCard, ...styles.expense}}>
            <span style={styles.summaryLabel}>📉 Ausgaben</span>
            <strong style={styles.summaryAmount}>CHF {expenseTotal.toFixed(2)}</strong>
          </div>

          <div style={{...styles.summaryCard, ...styles.balance}}>
            <span style={styles.summaryLabel}>💵 Saldo</span>
            <strong style={styles.summaryAmount}>CHF {balance.toFixed(2)}</strong>
          </div>
        </div>
      </header>

      <div style={styles.layout}>
        {/* LINKE SPALTE */}
        <div style={styles.leftColumn}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>➕ Neue Transaktion</h2>
            <TransactionForm onAdd={addTransaction} savingsGoals={savingsGoals} />
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>🕒 Letzte 10 Transaktionen</h2>

            <div style={styles.searchBox}>
              <input
                type="text"
                placeholder="🔍 Transaktion suchen…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={styles.searchSelect}
              >
                <option value="all">Alle</option>
                <option value="income">Einnahmen</option>
                <option value="expense">Ausgaben</option>
              </select>
            </div>

            {filteredTransactions.length === 0 ? (
              <p style={styles.empty}>Keine passenden Transaktionen gefunden</p>
            ) : (
              <TransactionList
                transactions={filteredTransactions}
                onDelete={deleteTransaction}
              />
            )}
          </section>
        </div>

        {/* RECHTE SPALTE */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>🎯 Sparziele</h2>

          <SavingsGoalForm onAdd={addSavingsGoal} />

          <div style={styles.savingsGrid}>
            {[...savingsGoals]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(goal => (
                <SavingsGoalCard
                  key={goal._id}
                  goal={goal}
                  onUpdate={updateSavingsGoal}
                  onDelete={deleteSavingsGoal}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// TransactionForm Component
function TransactionForm({ onAdd, savingsGoals }) {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text && amount) {
      onAdd({ text, amount: parseFloat(amount), type });
      setText('');
      setAmount('');
    }
  };

  return (
    <div style={styles.form}>
      <input
        type="text"
        placeholder="Beschreibung"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Betrag"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      />
      <div style={styles.typeButtons}>
        <button
          type="button"
          onClick={() => setType('income')}
          style={{
            ...styles.typeButton,
            ...(type === 'income' ? styles.typeButtonActive : styles.typeButtonInactive),
            backgroundColor: type === 'income' ? '#10b981' : '#f3f4f6'
          }}
        >
          Einnahme
        </button>
        <button
          type="button"
          onClick={() => setType('expense')}
          style={{
            ...styles.typeButton,
            ...(type === 'expense' ? styles.typeButtonActive : styles.typeButtonInactive),
            backgroundColor: type === 'expense' ? '#ef4444' : '#f3f4f6'
          }}
        >
          Ausgabe
        </button>
      </div>
      <button onClick={handleSubmit} style={styles.submitButton}>
        Hinzufügen
      </button>
    </div>
  );
}

// TransactionList Component
function TransactionList({ transactions, onDelete }) {
  return (
    <div style={styles.transactionList}>
      {transactions.map(txn => (
        <div key={txn._id} style={styles.transactionItem}>
          <div style={styles.transactionInfo}>
            <span style={{
              ...styles.transactionIcon,
              backgroundColor: txn.type === 'income' ? '#d1fae5' : '#fee2e2',
              color: txn.type === 'income' ? '#059669' : '#dc2626'
            }}>
              {txn.type === 'income' ? '📈' : '📉'}
            </span>
            <div>
              <div style={styles.transactionText}>{txn.text}</div>
              <div style={styles.transactionDate}>
                {new Date(txn.createdAt).toLocaleDateString('de-CH')}
              </div>
            </div>
          </div>
          <div style={styles.transactionRight}>
            <span style={{
              ...styles.transactionAmount,
              color: txn.type === 'income' ? '#10b981' : '#ef4444'
            }}>
              {txn.type === 'income' ? '+' : '-'} CHF {Number(txn.amount).toFixed(2)}
            </span>
            <button
              onClick={() => onDelete(txn._id)}
              style={styles.deleteButton}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// SavingsGoalForm Component
function SavingsGoalForm({ onAdd }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && targetAmount) {
      onAdd({ name, targetAmount: parseFloat(targetAmount), currentAmount: 0 });
      setName('');
      setTargetAmount('');
    }
  };

  return (
    <div style={styles.form}>
      <input
        type="text"
        placeholder="Zielname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Zielbetrag"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSubmit} style={styles.submitButton}>
        Sparziel erstellen
      </button>
    </div>
  );
}

// SavingsGoalCard Component
function SavingsGoalCard({ goal, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState('');
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const handleUpdate = () => {
    if (amount) {
      onUpdate(goal._id, parseFloat(amount));
      setAmount('');
      setIsEditing(false);
    }
  };

  return (
    <div style={styles.savingsCard}>
      <div style={styles.savingsHeader}>
        <div style={styles.savingsTitle}>
          <span>🎯</span>
          <h3 style={styles.savingsName}>{goal.name}</h3>
        </div>
        <button
          onClick={() => onDelete(goal._id)}
          style={styles.deleteButtonSmall}
        >
          🗑️
        </button>
      </div>

      <div style={styles.savingsProgress}>
        <div style={styles.savingsAmounts}>
          <span style={styles.savingsAmount}>CHF {goal.currentAmount.toFixed(2)}</span>
          <span style={styles.savingsAmount}>CHF {goal.targetAmount.toFixed(2)}</span>
        </div>
        
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${Math.min(progress, 100)}%`
            }}
          />
        </div>
        
        <div style={styles.progressText}>
          {progress.toFixed(1)}%
        </div>
      </div>

      {isEditing ? (
        <div style={styles.editAmount}>
          <input
            type="number"
            step="0.01"
            placeholder="Betrag"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.editInput}
          />
          <button onClick={handleUpdate} style={styles.checkButton}>
            ✓
          </button>
          <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          style={styles.addAmountButton}
        >
          Betrag hinzufügen
        </button>
      )}
    </div>
  );
}

// Inline Styles
const styles = {
  dashboard: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh'
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '28px',
    marginTop: 0
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  summaryCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden'
  },
  summaryLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    opacity: 0.8
  },
  summaryAmount: {
    fontSize: '2rem',
    fontWeight: '700',
    display: 'block'
  },
  income: {
    background: 'linear-gradient(135deg, #ffffff, #d1fae5)',
    borderTop: '4px solid #10b981'
  },
  expense: {
    background: 'linear-gradient(135deg, #ffffff, #fee2e2)',
    borderTop: '4px solid #ef4444'
  },
  balance: {
    background: 'linear-gradient(135deg, #ffffff, #dbeafe)',
    borderTop: '4px solid #3b82f6'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '32px',
    alignItems: 'flex-start'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '24px',
    marginTop: 0
  },
  searchBox: {
    display: 'flex',
    gap: '14px',
    marginBottom: '24px'
  },
  searchInput: {
    flex: 1,
    padding: '14px 16px',
    borderRadius: '14px',
    border: '2px solid #e5e7eb',
    fontSize: '0.95rem',
    outline: 'none'
  },
  searchSelect: {
    padding: '14px 16px',
    borderRadius: '14px',
    border: '2px solid #e5e7eb',
    fontSize: '0.95rem',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '140px'
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '48px 24px',
    fontSize: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '1rem',
    outline: 'none'
  },
  typeButtons: {
    display: 'flex',
    gap: '12px'
  },
  typeButton: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  typeButtonActive: {
    color: 'white'
  },
  typeButtonInactive: {
    color: '#374151'
  },
  submitButton: {
    width: '100%',
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '12px',
    transition: 'background 0.2s'
  },
  transactionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  transactionIcon: {
    padding: '8px',
    borderRadius: '8px',
    fontSize: '1.2rem'
  },
  transactionText: {
    fontWeight: '500',
    color: '#1f2937'
  },
  transactionDate: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  transactionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: '1rem'
  },
  deleteButton: {
    padding: '6px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    borderRadius: '6px',
    transition: 'background 0.2s'
  },
  savingsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px'
  },
  savingsCard: {
    background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
    borderRadius: '12px',
    padding: '20px',
    border: '2px solid #e0e7ff'
  },
  savingsHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  savingsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  savingsName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  deleteButtonSmall: {
    padding: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '4px'
  },
  savingsProgress: {
    marginBottom: '12px'
  },
  savingsAmounts: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '8px'
  },
  savingsAmount: {
    fontWeight: '500'
  },
  progressBar: {
    width: '100%',
    background: '#e5e7eb',
    borderRadius: '9999px',
    height: '8px',
    overflow: 'hidden'
  },
  progressFill: {
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    height: '100%',
    transition: 'width 0.5s',
    borderRadius: '9999px'
  },
  progressText: {
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6366f1',
    marginTop: '8px'
  },
  editAmount: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px'
  },
  editInput: {
    flex: 1,
    padding: '8px 12px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none'
  },
  checkButton: {
    padding: '8px 12px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  cancelButton: {
    padding: '8px 12px',
    background: '#d1d5db',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  addAmountButton: {
    width: '100%',
    marginTop: '12px',
    padding: '8px',
    fontSize: '0.875rem',
    background: 'white',
    border: '2px solid #c7d2fe',
    color: '#6366f1',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};

export default Dashboard;