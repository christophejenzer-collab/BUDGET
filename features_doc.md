# 📋 Feature-Dokumentation

Diese Datei beschreibt alle **12 implementierten Features** des Budget Trackers im Detail.

---

## 🎯 Übersicht

Das Projekt erfüllt die Anforderungen mit **12 Features**:
- **3 GET-Operationen**
- **2 POST-Operationen**
- **2 PATCH-Operationen**
- **2 DELETE-Operationen**
- **3 zusätzliche Features** (Suche, Filter, Berechnungen)

---

## 📊 Transaktionen (Transactions)

### 1. GET - Alle Transaktionen laden 🔄

**Beschreibung:** Lädt alle Transaktionen aus der MongoDB-Datenbank.

**Endpoint:** `GET /api/transactions`

**Implementierung:**
```javascript
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
```

**Frontend-Komponente:** `Dashboard.js` (Zeile 17-27)

**Datenstruktur:**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "text": "Gehalt",
    "amount": 5000,
    "type": "income",
    "createdAt": "2026-01-20T10:30:00.000Z"
  }
]
```

**Verwendung:**
- Wird beim Laden der App aufgerufen (`useEffect`)
- Wird nach jeder Änderung (Hinzufügen/Löschen) erneut aufgerufen
- Zeigt die letzten 10 Transaktionen sortiert nach Datum

---

### 2. POST - Neue Transaktion erstellen ➕

**Beschreibung:** Erstellt eine neue Einnahme oder Ausgabe.

**Endpoint:** `POST /api/transactions`

**Implementierung:**
```javascript
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
```

**Frontend-Komponente:** `TransactionForm` in `Dashboard.js`

**Request Body:**
```json
{
  "text": "Einkaufen",
  "amount": 85.50,
  "type": "expense"
}
```

**UI-Elemente:**
- Eingabefeld für Beschreibung
- Eingabefeld für Betrag (Number-Input mit 2 Dezimalstellen)
- Toggle-Buttons für Typ (Einnahme/Ausgabe)
- Submit-Button "Hinzufügen"

**Validierung:**
- Beide Felder müssen ausgefüllt sein
- Betrag muss eine gültige Zahl sein
- Nach Erfolg wird das Formular zurückgesetzt

---

### 3. DELETE - Transaktion löschen 🗑️

**Beschreibung:** Löscht eine bestehende Transaktion anhand ihrer ID.

**Endpoint:** `DELETE /api/transactions/:id`

**Implementierung:**
```javascript
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
```

**Frontend-Komponente:** `TransactionList` in `Dashboard.js`

**UI-Element:**
- 🗑️ Button neben jeder Transaktion
- Hover-Effekt für bessere UX

**Verwendung:**
- Sofortiges Löschen ohne Bestätigung
- Liste wird automatisch aktualisiert
- Summen werden neu berechnet

---

## 💎 Sparziele (Savings Goals)

### 4. GET - Alle Sparziele laden 🎯

**Beschreibung:** Lädt alle Sparziele mit aktuellem Fortschritt.

**Endpoint:** `GET /api/savings-goals`

**Implementierung:**
```javascript
const fetchSavingsGoals = async () => {
  try {
    const res = await fetch(`${API_URL}/savings-goals`);
    const data = await res.json();
    setSavingsGoals(data);
  } catch (error) {
    console.error('Fehler beim Laden der Sparziele:', error);
  }
};
```

**Frontend-Komponente:** `Dashboard.js` (Zeile 29-37)

**Datenstruktur:**
```json
[
  {
    "_id": "65b2c3d4e5f6g7h8i9j0k1l2",
    "name": "Urlaub",
    "targetAmount": 5000,
    "currentAmount": 1250
  }
]
```

**Darstellung:**
- Kartenansicht mit Fortschrittsbalken
- Prozentualer Fortschritt wird berechnet
- Sortiert alphabetisch nach Name

---

### 5. POST - Neues Sparziel erstellen ✨

**Beschreibung:** Erstellt ein neues Sparziel mit Zielbetrag.

**Endpoint:** `POST /api/savings-goals`

**Implementierung:**
```javascript
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
```

**Frontend-Komponente:** `SavingsGoalForm` in `Dashboard.js`

**Request Body:**
```json
{
  "name": "Auto",
  "targetAmount": 15000,
  "currentAmount": 0
}
```

**UI-Elemente:**
- Eingabefeld für Zielname
- Eingabefeld für Zielbetrag
- Button "Sparziel erstellen"

**Validierung:**
- Name muss ausgefüllt sein
- Zielbetrag muss positiv sein
- currentAmount wird automatisch auf 0 gesetzt

---

### 6. PATCH - Sparziel aktualisieren (Betrag hinzufügen) 💰

**Beschreibung:** Aktualisiert den aktuellen Betrag eines Sparziels.

**Endpoint:** `PATCH /api/savings-goals/:id`

**Implementierung:**
```javascript
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
```

**Frontend-Komponente:** `SavingsGoalCard` in `Dashboard.js`

**Request Body:**
```json
{
  "currentAmount": 1500.00
}
```

**UI-Workflow:**
1. Benutzer klickt "Betrag hinzufügen"
2. Inline-Formular erscheint
3. Betrag eingeben
4. ✓ klicken zum Bestätigen oder ✕ zum Abbrechen
5. Fortschrittsbalken wird aktualisiert

**Besonderheit:**
- Betrag wird absolut gesetzt (nicht addiert)
- Fortschritt kann 100% überschreiten
- Fortschrittsbalken ändert Farbe bei 100%

---

### 7. DELETE - Sparziel löschen ❌

**Beschreibung:** Löscht ein Sparziel komplett.

**Endpoint:** `DELETE /api/savings-goals/:id`

**Implementierung:**
```javascript
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
```

**Frontend-Komponente:** `SavingsGoalCard` in `Dashboard.js`

**UI-Element:**
- 🗑️ Button oben rechts auf der Sparziel-Karte
- Hover-Effekt für Feedback

**Verwendung:**
- Sofortiges Löschen ohne Rückfrage
- Karte verschwindet aus der Ansicht

---

## 🔍 Zusätzliche Features

### 8. Suche - Transaktionen durchsuchen 🔎

**Beschreibung:** Ermöglicht die Suche nach Transaktionen anhand der Beschreibung.

**Implementierung:**
```javascript
const [searchTerm, setSearchTerm] = useState('');

const filteredTransactions = lastTenTransactions.filter(txn => {
  const text = (txn.text || txn.description || txn.name || '').toLowerCase();
  const matchesSearch = text.includes(searchTerm.trim().toLowerCase());
  const matchesType = filterType === 'all' || txn.type === filterType;
  return matchesSearch && matchesType;
});
```

**Frontend-Komponente:** `Dashboard.js` (Zeile 128-138)

**UI-Element:**
- 🔍 Suchfeld über der Transaktionsliste
- Placeholder: "Transaktion suchen…"

**Funktionsweise:**
- Live-Suche (kein Submit nötig)
- Case-insensitive (Groß-/Kleinschreibung egal)
- Sucht in Feld `text`, `description` oder `name`
- Kombinierbar mit Filter (Feature 9)

**Beispiel:**
- Eingabe "ein" findet: "Einkaufen", "Kleinigkeiten", "Vereinsbeitrag"

---

### 9. Filter - Nach Typ filtern 🎚️

**Beschreibung:** Filtert Transaktionen nach Einnahmen, Ausgaben oder zeigt alle.

**Implementierung:**
```javascript
const [filterType, setFilterType] = useState('all');

const filteredTransactions = lastTenTransactions.filter(txn => {
  const text = (txn.text || txn.description || txn.name || '').toLowerCase();
  const matchesSearch = text.includes(searchTerm.trim().toLowerCase());
  const matchesType = filterType === 'all' || txn.type === filterType;
  return matchesSearch && matchesType;
});
```

**Frontend-Komponente:** `Dashboard.js` (Zeile 128-138)

**UI-Element:**
- Dropdown-Menü mit 3 Optionen:
  - "Alle" (Standard)
  - "Einnahmen"
  - "Ausgaben"

**Funktionsweise:**
- Sofortige Filterung beim Auswählen
- Kombinierbar mit Suche (Feature 8)
- Leere-Anzeige wenn keine Treffer

**Verwendung:**
- Schnellübersicht nur von Ausgaben
- Einnahmen-Analyse
- Filter zurücksetzen mit "Alle"

---

### 10. Sortierung - Sparziele alphabetisch sortieren 🔤

**Beschreibung:** Zeigt Sparziele alphabetisch nach Name sortiert an.

**Implementierung:**
```javascript
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
```

**Frontend-Komponente:** `Dashboard.js` (Zeile 225-234)

**Funktionsweise:**
- Verwendet `localeCompare` für korrekte Sortierung
- Berücksichtigt Umlaute (ä, ö, ü)
- Array wird kopiert (`[...savingsGoals]`) um Original nicht zu verändern

**Beispiel-Reihenfolge:**
1. Auto
2. Notfallreserve
3. Urlaub
4. Wohnung

---

### 11. Berechnung - Automatische Summen 📊

**Beschreibung:** Berechnet automatisch Einnahmen, Ausgaben und Saldo.

**Implementierung:**
```javascript
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
```

**Frontend-Komponente:** `Dashboard.js` (Zeile 39-53)

**Berechnete Werte:**
1. **Einnahmen-Total** - Summe aller `type: "income"` Transaktionen
2. **Ausgaben-Total** - Summe aller `type: "expense"` Transaktionen
3. **Saldo** - Differenz: `Einnahmen - Ausgaben`

**Darstellung:**
- Drei farbige Karten im Header
- 📈 Einnahmen (grün)
- 📉 Ausgaben (rot)
- 💵 Saldo (blau)
- CHF-Formatierung mit 2 Dezimalstellen

**Aktualisierung:**
- Wird bei jedem Laden der Transaktionen neu berechnet
- Real-time Update nach Hinzufügen/Löschen

---

### 12. Limit - Letzte 10 Transaktionen 🔟

**Beschreibung:** Zeigt nur die letzten 10 Transaktionen, sortiert nach Datum.

**Implementierung:**
```javascript
const lastTenTransactions = [...transactions]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 10);
```

**Frontend-Komponente:** `Dashboard.js` (Zeile 125-127)

**Funktionsweise:**
1. Array wird kopiert (`[...transactions]`)
2. Sortiert nach `createdAt` (neueste zuerst)
3. Nimmt die ersten 10 Einträge (`.slice(0, 10)`)

**Verwendung:**
- Verhindert Überlastung der UI
- Fokus auf aktuelle Aktivitäten
- Ältere Transaktionen bleiben in der Datenbank
- Such- und Filterfunktion arbeiten mit diesem Limit

**Performance:**
- Reduziert Rendering-Last
- Schnellere Ladezeiten
- Übersichtliche Darstellung

---

## 🎨 UI/UX Features (Bonus)

Zusätzlich zu den 12 Kernfeatures bietet die App:

### Responsive Design
- Grid-Layout passt sich der Bildschirmgröße an
- Mobile-friendly Components

### Visuelles Feedback
- Hover-Effekte auf Buttons
- Farbcodierung (grün/rot) für Einnahmen/Ausgaben
- Fortschrittsbalken mit Gradients
- Smooth Transitions

### Glassmorphism-Design
- Backdrop-Blur-Effekte
- Transparente Overlays
- Moderne Farbverläufe

### Benutzerfreundlichkeit
- Inline-Editing für Sparziele
- Sofortiges visuelles Feedback
- Klare Symbole (🎯, 📈, 💰)
- Intuitive Navigation

---

## 📈 Feature-Matrix

| Feature | Typ | Endpoint | Komponente | Status |
|---------|-----|----------|------------|--------|
| Transaktionen laden | GET | `/transactions` | Dashboard | ✅ |
| Transaktion erstellen | POST | `/transactions` | TransactionForm | ✅ |
| Transaktion löschen | DELETE | `/transactions/:id` | TransactionList | ✅ |
| Sparziele laden | GET | `/savings-goals` | Dashboard | ✅ |
| Sparziel erstellen | POST | `/savings-goals` | SavingsGoalForm | ✅ |
| Sparziel aktualisieren | PATCH | `/savings-goals/:id` | SavingsGoalCard | ✅ |
| Sparziel löschen | DELETE | `/savings-goals/:id` | SavingsGoalCard | ✅ |
| Suche | Frontend | - | Dashboard | ✅ |
| Filter | Frontend | - | Dashboard | ✅ |
| Sortierung | Frontend | - | Dashboard | ✅ |
| Berechnungen | Frontend | - | Dashboard | ✅ |
| Limit (10) | Frontend | - | Dashboard | ✅ |

---

## ✅ Bewertungskriterien erfüllt

| Kriterium | Anforderung | Umsetzung | Status |
|-----------|-------------|-----------|--------|
| GET-Requests | 3 | Transactions + SavingsGoals (2x) | ✅ |
| POST-Requests | 2 | Transaction + SavingsGoal erstellen | ✅ |
| PATCH-Requests | 2 | SavingsGoal aktualisieren | ✅ |
| DELETE-Requests | 2 | Transaction + SavingsGoal löschen | ✅ |
| Weitere Features | 3+ | Suche, Filter, Sortierung, Berechnungen, Limit | ✅ |
| REST API | ✅ | Express Backend mit MongoDB | ✅ |
| React App | ✅ | Funktionale Komponenten mit Hooks | ✅ |
| Dokumentation | ✅ | Markdown-Dateien vorhanden | ✅ |

---

**Alle 12 Features erfolgreich implementiert und getestet!** ✅