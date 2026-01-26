# 🏗️ Technische Dokumentation

Detaillierte technische Architektur und Implementierungsdetails des Budget Trackers.

---

## 📋 Inhaltsverzeichnis

- [Systemarchitektur](#systemarchitektur)
- [Frontend-Architektur](#frontend-architektur)
- [Backend-Architektur](#backend-architektur)
- [Datenbank-Design](#datenbank-design)
- [State Management](#state-management)
- [API-Integration](#api-integration)
- [Styling & UI](#styling--ui)
- [Performance-Optimierungen](#performance-optimierungen)

---

## 🎯 Systemarchitektur

### Überblick

Der Budget Tracker folgt einer klassischen **3-Tier-Architektur**:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│     React Frontend (Port 3000)          │
│   - Components                          │
│   - State Management                    │
│   - UI/UX                               │
└─────────────┬───────────────────────────┘
              │ HTTP REST API
              │ (Axios)
┌─────────────▼───────────────────────────┐
│         Application Layer               │
│    Node.js + Express (Port 5000)        │
│   - Routes                              │
│   - Controllers                         │
│   - Business Logic                      │
└─────────────┬───────────────────────────┘
              │ Mongoose ODM
              │
┌─────────────▼───────────────────────────┐
│          Data Layer                     │
│       MongoDB Atlas (Cloud)             │
│   - Collections                         │
│   - Schemas                             │
│   - Indexes                             │
└─────────────────────────────────────────┘
```

### Technologie-Stack

#### Frontend
| Technologie | Version | Verwendung |
|-------------|---------|------------|
| React | 18.x | UI Framework |
| Axios | 1.13.2 | HTTP Client |
| JavaScript (ES6+) | - | Programmiersprache |
| CSS3 | - | Styling |

#### Backend
| Technologie | Version | Verwendung |
|-------------|---------|------------|
| Node.js | 16+ | Runtime Environment |
| Express.js | 4.x | Web Framework |
| Mongoose | 7.x | MongoDB ODM |
| CORS | 2.x | Cross-Origin Requests |
| dotenv | 16.x | Environment Variables |

#### Datenbank
| Technologie | Version | Verwendung |
|-------------|---------|------------|
| MongoDB Atlas | 6.0+ | Cloud Database |
| MongoDB Compass | - | GUI (optional) |

---

## ⚛️ Frontend-Architektur

### Projektstruktur

```
frontend/
├── public/
│   ├── index.html          # HTML Template
│   ├── favicon.ico         # App Icon
│   ├── logo192.png         # Logo
│   ├── logo512.png         # Logo
│   ├── manifest.json       # PWA Manifest
│   └── robots.txt          # SEO
│
├── src/
│   ├── components/
│   │   └── Dashboard.js    # Haupt-Komponente (alle Sub-Components)
│   │
│   ├── App.js              # Root Component
│   ├── App.css             # Global Styles
│   ├── index.js            # Entry Point
│   ├── index.css           # Base Styles
│   │
│   ├── reportWebVitals.js  # Performance Monitoring
│   └── setupTests.js       # Test Configuration
│
├── package.json            # Dependencies
└── README.md               # Frontend-Docs
```

### Komponenten-Hierarchie

```
App
└── Dashboard
    ├── TransactionForm
    ├── TransactionList
    ├── SavingsGoalForm
    └── SavingsGoalCard
```

### Komponenten-Details

#### 1. Dashboard (Haupt-Komponente)

**Datei:** `src/components/Dashboard.js`

**Verantwortlichkeiten:**
- State Management für gesamte App
- API-Calls (CRUD-Operationen)
- Daten-Aggregation (Berechnungen)
- Layout-Struktur

**State:**
```javascript
const [transactions, setTransactions] = useState([]);      // Alle Transaktionen
const [savingsGoals, setSavingsGoals] = useState([]);      // Alle Sparziele
const [incomeTotal, setIncomeTotal] = useState(0);         // Einnahmen-Summe
const [expenseTotal, setExpenseTotal] = useState(0);       // Ausgaben-Summe
const [balance, setBalance] = useState(0);                 // Saldo
const [searchTerm, setSearchTerm] = useState('');          // Such-Term
const [filterType, setFilterType] = useState('all');       // Filter
```

**Lifecycle:**
```javascript
useEffect(() => {
  fetchTransactions();  // Initial Load
  fetchSavingsGoals();  // Initial Load
}, []);                 // Nur beim Mount
```

**Besonderheiten:**
- Alle Sub-Komponenten sind im selben File (kein separates Import nötig)
- Inline-Styles für schnelle Entwicklung
- Functional Component mit Hooks

---

#### 2. TransactionForm

**Props:**
- `onAdd: Function` - Callback zum Hinzufügen
- `savingsGoals: Array` - Liste der Sparziele (ungenutzt, für spätere Features)

**State:**
```javascript
const [text, setText] = useState('');           // Beschreibung
const [amount, setAmount] = useState('');       // Betrag
const [type, setType] = useState('expense');    // Typ (income/expense)
```

**Validierung:**
```javascript
if (text && amount) {
  onAdd({ text, amount: parseFloat(amount), type });
  // Reset Form
}
```

---

#### 3. TransactionList

**Props:**
- `transactions: Array` - Anzuzeigende Transaktionen
- `onDelete: Function` - Callback zum Löschen

**Features:**
- Iteration über Transaktionen
- Datum-Formatierung: `new Date(txn.createdAt).toLocaleDateString('de-CH')`
- Farbcodierung: Grün für Income, Rot für Expense

---

#### 4. SavingsGoalForm

**Props:**
- `onAdd: Function` - Callback zum Erstellen

**State:**
```javascript
const [name, setName] = useState('');               // Name des Ziels
const [targetAmount, setTargetAmount] = useState(''); // Zielbetrag
```

**Submit:**
```javascript
onAdd({ 
  name, 
  targetAmount: parseFloat(targetAmount), 
  currentAmount: 0 
});
```

---

#### 5. SavingsGoalCard

**Props:**
- `goal: Object` - Sparziel-Objekt
- `onUpdate: Function` - Callback zum Aktualisieren
- `onDelete: Function` - Callback zum Löschen

**State:**
```javascript
const [isEditing, setIsEditing] = useState(false); // Edit-Modus
const [amount, setAmount] = useState('');          // Neuer Betrag
```

**Fortschritts-Berechnung:**
```javascript
const progress = (goal.currentAmount / goal.targetAmount) * 100;
```

**Features:**
- Inline-Editing (Toggle zwischen Anzeige und Edit)
- Fortschrittsbalken mit dynamischer Breite
- Farb-Wechsel bei 100%

---

## 🖥️ Backend-Architektur

### Projektstruktur

```
backend/
├── models/
│   ├── Transaction.js      # Transaction Schema
│   └── SavingsGoal.js      # SavingsGoal Schema
│
├── routes/
│   ├── transactions.js     # Transaction Routes
│   └── savingsGoals.js     # SavingsGoal Routes
│
├── server.js               # Entry Point
├── .env                    # Environment Variables
├── .gitignore              # Git Ignore
└── package.json            # Dependencies
```

### Server Setup (server.js)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/savings-goals', require('./routes/savingsGoals'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB verbunden!'))
  .catch(err => console.error('MongoDB Fehler:', err));

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
```

### Middleware-Stack

1. **CORS** - Erlaubt Requests von Frontend
2. **express.json()** - Parst JSON-Body
3. **Routes** - Routing-Handler
4. **Error Handler** - Fehlerbehandlung (implicit)

---

## 🗄️ Datenbank-Design

### MongoDB Collections

#### 1. transactions Collection

**Schema:**
```javascript
const TransactionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Beschreibung ist erforderlich'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Betrag ist erforderlich'],
    min: [0, 'Betrag muss positiv sein']
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ['income', 'expense'],
      message: 'Typ muss income oder expense sein'
    }
  }
}, {
  timestamps: true  // createdAt, updatedAt
});
```

**Beispiel-Dokument:**
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "text": "Gehalt Januar",
  "amount": 5000,
  "type": "income",
  "createdAt": ISODate("2026-01-15T08:30:00.000Z"),
  "updatedAt": ISODate("2026-01-15T08:30:00.000Z"),
  "__v": 0
}
```

**Indexes:**
- `_id` - Automatic (Primary Key)
- `createdAt` - Für Sortierung (optional)

---

#### 2. savingsgoals Collection

**Schema:**
```javascript
const SavingsGoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name ist erforderlich'],
    trim: true
  },
  targetAmount: {
    type: Number,
    required: [true, 'Zielbetrag ist erforderlich'],
    min: [0, 'Zielbetrag muss positiv sein']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Aktueller Betrag kann nicht negativ sein']
  }
}, {
  timestamps: true
});
```

**Beispiel-Dokument:**
```json
{
  "_id": ObjectId("65b1c2d3e4f5g6h7i8j9k0l1"),
  "name": "Urlaub",
  "targetAmount": 5000,
  "currentAmount": 1250,
  "createdAt": ISODate("2026-01-10T12:00:00.000Z"),
  "updatedAt": ISODate("2026-01-20T15:30:00.000Z"),
  "__v": 0
}
```

**Indexes:**
- `_id` - Automatic (Primary Key)
- `name` - Für alphabetische Sortierung (optional)

---

### Datenbank-Beziehungen

**Aktuell:** Keine Beziehungen zwischen Collections (Flat Structure)

**Zukünftig möglich:**
- User-Collection mit References zu Transactions/SavingsGoals
- Category-Collection für Transaktionen

---

## 🔄 State Management

### Lift State Up Pattern

Alle States leben in der **Dashboard-Komponente** und werden via Props an Child-Components weitergegeben.

```
Dashboard (State Owner)
│
├─► TransactionForm (Props: onAdd, savingsGoals)
│
├─► TransactionList (Props: transactions, onDelete)
│
├─► SavingsGoalForm (Props: onAdd)
│
└─► SavingsGoalCard (Props: goal, onUpdate, onDelete)
```

**Vorteile:**
- Einfache Implementierung
- Keine externe Library nötig
- Single Source of Truth

**Nachteile:**
- Prop Drilling bei tiefer Hierarchie
- Re-renders der gesamten Dashboard-Component

### State-Update-Flow

**Beispiel: Transaktion hinzufügen**

```
1. User gibt Daten im TransactionForm ein
2. User klickt "Hinzufügen"
3. onAdd() wird aufgerufen (Prop-Function)
   ↓
4. Dashboard.addTransaction() wird ausgeführt
   ↓
5. POST-Request an API
   ↓
6. fetchTransactions() lädt neue Daten
   ↓
7. setTransactions() aktualisiert State
   ↓
8. React re-rendert Dashboard + Children
   ↓
9. Neue Transaktion erscheint in UI
```

---

## 🌐 API-Integration

### Axios vs. Fetch

Die App verwendet **Fetch API** (nativ) statt Axios, obwohl Axios in `package.json` ist.

**Aktuelle Implementierung:**
```javascript
const res = await fetch(`${API_URL}/transactions`);
const data = await res.json();
```

**Mit Axios wäre es:**
```javascript
const { data } = await axios.get(`${API_URL}/transactions`);
```

### Error Handling

**Aktuell:**
```javascript
try {
  const res = await fetch(`${API_URL}/transactions`);
  const data = await res.json();
  setTransactions(data);
} catch (error) {
  console.error('Fehler beim Laden:', error);
}
```

**Verbesserung möglich:**
```javascript
try {
  const res = await fetch(`${API_URL}/transactions`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  setTransactions(data);
} catch (error) {
  console.error('Fehler:', error);
  // User-Feedback (Toast/Alert)
}
```

### Request-Flow

```
Frontend                Backend              Database
   │                       │                    │
   ├─ POST /transactions ─►│                    │
   │                       ├─ Validate ─────────┤
   │                       │                    │
   │                       ├─ Save ────────────►│
   │                       │                    │
   │◄─────── 201 ──────────┤◄─── Document ──────┤
   │                       │                    │
   ├─ GET /transactions ──►│                    │
   │                       ├─ Query ───────────►│
   │                       │                    │
   │◄────── Data ──────────┤◄──── Results ──────┤
```

---

## 🎨 Styling & UI

### Design-System

**Farbpalette:**
```css
/* Primärfarben */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--secondary-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);

/* Einnahmen */
--income-bg: #d1fae5;
--income-text: #059669;
--income-border: #10b981;

/* Ausgaben */
--expense-bg: #fee2e2;
--expense-text: #dc2626;
--expense-border: #ef4444;

/* Saldo */
--balance-bg: #dbeafe;
--balance-text: #2563eb;
--balance-border: #3b82f6;
```

**Typography:**
- Font: System-Font-Stack (San Francisco, Segoe UI, etc.)
- Sizes: 0.75rem - 2.5rem
- Weights: 500, 600, 700, 800

### Styling-Ansatz

**Inline-Styles:**
```javascript
const styles = {
  dashboard: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh'
  },
  // ... weitere Styles
};

// Verwendung:
<div style={styles.dashboard}>...</div>
```

**Vorteile:**
- Component-scoped (kein CSS-Clash)
- JavaScript-Power (Conditionals, Variables)
- Keine separate CSS-Datei nötig

**Nachteile:**
- Keine Pseudo-Klassen (:hover inline nicht möglich)
- Performance bei vielen Styles
- Keine Media Queries inline

### Responsiveness

**Grid-Layout:**
```javascript
gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
```

Auto-responsive ohne Media Queries!

**Breakpoints (implizit):**
- Mobile: < 600px (Single Column)
- Tablet: 600-1200px (2 Columns)
- Desktop: > 1200px (3 Columns)

---

## ⚡ Performance-Optimierungen

### Implementierte Optimierungen

#### 1. Limitierung auf 10 Transaktionen
```javascript
const lastTenTransactions = [...transactions]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 10);
```

**Effekt:** Reduziert Rendering-Last und DOM-Nodes

#### 2. Lokale Filterung
```javascript
const filteredTransactions = lastTenTransactions.filter(/* ... */);
```

**Effekt:** Keine zusätzlichen API-Calls, instant Feedback

#### 3. Conditional Rendering
```javascript
{filteredTransactions.length === 0 ? (
  <p>Keine Transaktionen</p>
) : (
  <TransactionList ... />
)}
```

**Effekt:** Rendert nur wenn nötig

### Mögliche Verbesserungen

#### 1. React.memo
```javascript
const TransactionList = React.memo(({ transactions, onDelete }) => {
  // Component Code
});
```

**Effekt:** Verhindert Re-Renders wenn Props gleich bleiben

#### 2. useCallback
```javascript
const deleteTransaction = useCallback(async (id) => {
  // Code
}, []);
```

**Effekt:** Stabile Funktions-Referenz

#### 3. useMemo
```javascript
const filteredTransactions = useMemo(() => {
  return lastTenTransactions.filter(/* ... */);
}, [lastTenTransactions, searchTerm, filterType]);
```

**Effekt:** Cached Berechnungen

#### 4. Virtualisierung
Für große Listen: `react-window` oder `react-virtualized`

#### 5. Debouncing für Suche
```javascript
const debouncedSearch = useDebounce(searchTerm, 300);
```

**Effekt:** Reduziert Filter-Operationen

---

## 🔐 Security-Überlegungen

### Aktuelle Situation

**Keine Authentication:** 
- Alle Daten sind öffentlich
- Keine User-Trennung

**Keine Input-Sanitization:**
- XSS-Anfällig bei Eingaben

### Empfehlungen für Produktion

#### 1. Authentication
```javascript
// JWT-basiert
const token = jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
```

#### 2. Input Validation
```javascript
// Backend mit express-validator
body('text').trim().isLength({ min: 1 }).escape()
```

#### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

#### 4. HTTPS
- Nur verschlüsselte Verbindungen
- Certificates mit Let's Encrypt

#### 5. Environment Variables
- Niemals `.env` in Git committen
- Secrets in Deployment-Plattform verwalten

---

## 📊 Architektur-Entscheidungen

### Warum keine Redux?

**Begründung:**
- App-Größe rechtfertigt Redux nicht
- Lift State Up reicht völlig aus
- Weniger Boilerplate-Code
- Einfacher zu verstehen für Anfänger

### Warum Inline-Styles?

**Begründung:**
- Schnelle Entwicklung
- Keine CSS-Namenskonflikte
- Component-scoped Styling
- Einfacher zu maintainen für kleine App

### Warum MongoDB?

**Begründung:**
- Flexible Schema (NoSQL)
- Schnelle Entwicklung
- Atlas bietet Free Tier
- Gute Node.js Integration

### Warum Fetch statt Axios?

**Begründung:**
- Nativ in Browsern
- Keine zusätzliche Dependency
- Ausreichend für einfache Requests

**Aber:** Axios ist in package.json → Wurde ursprünglich geplant, dann aber nicht genutzt

---

## 🧪 Testing-Strategie

### Aktuell: Keine Tests

**Empfohlene Test-Pyramide:**

```
        ┌──────────┐
        │   E2E    │  (Cypress, Playwright)
        ├──────────┤
        │Integration│  (React Testing Library)
        ├──────────┤
        │   Unit   │  (Jest)
        └──────────┘
```

### Test-Beispiele

#### Unit Test (Jest)
```javascript
test('calculateSummary berechnet korrekt', () => {
  const txns = [
    { amount: 100, type: 'income' },
    { amount: 50, type: 'expense' }
  ];
  const result = calculateSummary(txns);
  expect(result.balance).toBe(50);
});
```

#### Component Test (React Testing Library)
```javascript
test('TransactionForm submittet Daten', () => {
  const mockAdd = jest.fn();
  render(<TransactionForm onAdd={mockAdd} />);
  
  fireEvent.change(screen.getByPlaceholderText('Beschreibung'), {
    target: { value: 'Test' }
  });
  fireEvent.click(screen.getByText('Hinzufügen'));
  
  expect(mockAdd).toHaveBeenCalledWith({
    text: 'Test',
    amount: expect.any(Number),
    type: 'expense'
  });
});
```

---

## 📈 Skalierbarkeit

### Aktuelle Limits

- **Users:** Single-User (keine Multi-Tenancy)
- **Data:** Unbegrenzt in MongoDB, aber UI zeigt nur 10 Transactions
- **Traffic:** Kein Load Balancing

### Skalierungs-Strategie

#### Horizontal Scaling
```
Load Balancer
     │
     ├─► Backend Instance 1
     ├─► Backend Instance 2
     └─► Backend Instance 3
          │
          └─► MongoDB (Replica Set)
```

#### Database Sharding
- Sharding nach User-ID
- Für Millionen von Transaktionen

#### Caching
```javascript
// Redis für häufige Queries
const cachedTransactions = await redis.get(`user:${userId}:transactions`);
```

---

**Diese technische Dokumentation wird regelmäßig aktualisiert!** 🔄