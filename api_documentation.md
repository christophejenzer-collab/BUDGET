# 📡 API-Dokumentation

REST API-Dokumentation für den Budget Tracker Backend-Service.

---

## 🌐 Base URL

```
http://localhost:5000/api
```

**Hinweis:** Port kann in der `.env`-Datei konfiguriert werden.

---

## 📋 Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Transactions API](#transactions-api)
- [Savings Goals API](#savings-goals-api)
- [Datenmodelle](#datenmodelle)
- [Fehlerbehandlung](#fehlerbehandlung)
- [Beispiel-Requests](#beispiel-requests)

---

## 🎯 Übersicht

Die API bietet zwei Hauptressourcen:
- **Transactions** - Verwaltung von Einnahmen und Ausgaben
- **Savings Goals** - Verwaltung von Sparzielen

Alle Endpoints verwenden:
- **Content-Type:** `application/json`
- **Database:** MongoDB Atlas
- **Authentication:** Keine (für Entwicklung)

---

## 💸 Transactions API

### 1. Alle Transaktionen abrufen

Gibt eine Liste aller Transaktionen zurück, sortiert nach Erstellungsdatum.

**Endpoint:**
```
GET /api/transactions
```

**Response:**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "text": "Gehalt Januar",
    "amount": 5000,
    "type": "income",
    "createdAt": "2026-01-15T08:30:00.000Z",
    "updatedAt": "2026-01-15T08:30:00.000Z",
    "__v": 0
  },
  {
    "_id": "65a2c3d4e5f6g7h8i9j0k1l2",
    "text": "Einkauf Migros",
    "amount": 125.50,
    "type": "expense",
    "createdAt": "2026-01-16T14:20:00.000Z",
    "updatedAt": "2026-01-16T14:20:00.000Z",
    "__v": 0
  }
]
```

**Status Codes:**
- `200 OK` - Erfolgreiche Anfrage
- `500 Internal Server Error` - Datenbankfehler

---

### 2. Neue Transaktion erstellen

Erstellt eine neue Einnahme oder Ausgabe.

**Endpoint:**
```
POST /api/transactions
```

**Request Body:**
```json
{
  "text": "Freelance Projekt",
  "amount": 1500.00,
  "type": "income"
}
```

**Validierung:**
- `text` - **Pflichtfeld**, String, min. 1 Zeichen
- `amount` - **Pflichtfeld**, Number, positiv
- `type` - **Pflichtfeld**, Enum: `"income"` oder `"expense"`

**Response:**
```json
{
  "_id": "65a3d4e5f6g7h8i9j0k1l2m3",
  "text": "Freelance Projekt",
  "amount": 1500.00,
  "type": "income",
  "createdAt": "2026-01-20T10:15:00.000Z",
  "updatedAt": "2026-01-20T10:15:00.000Z",
  "__v": 0
}
```

**Status Codes:**
- `201 Created` - Transaktion erfolgreich erstellt
- `400 Bad Request` - Validierungsfehler
- `500 Internal Server Error` - Datenbankfehler

---

### 3. Transaktion löschen

Löscht eine bestehende Transaktion anhand ihrer ID.

**Endpoint:**
```
DELETE /api/transactions/:id
```

**URL Parameter:**
- `id` - MongoDB ObjectId der Transaktion

**Beispiel:**
```
DELETE /api/transactions/65a1b2c3d4e5f6g7h8i9j0k1
```

**Response:**
```json
{
  "message": "Transaktion erfolgreich gelöscht",
  "deletedId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Status Codes:**
- `200 OK` - Transaktion erfolgreich gelöscht
- `404 Not Found` - Transaktion nicht gefunden
- `500 Internal Server Error` - Datenbankfehler

---

## 🎯 Savings Goals API

### 1. Alle Sparziele abrufen

Gibt eine Liste aller Sparziele mit aktuellem Fortschritt zurück.

**Endpoint:**
```
GET /api/savings-goals
```

**Response:**
```json
[
  {
    "_id": "65b1c2d3e4f5g6h7i8j9k0l1",
    "name": "Sommerurlaub",
    "targetAmount": 5000,
    "currentAmount": 1250,
    "createdAt": "2026-01-10T12:00:00.000Z",
    "updatedAt": "2026-01-20T15:30:00.000Z",
    "__v": 0
  },
  {
    "_id": "65b2c3d4e5f6g7h8i9j0k1l2",
    "name": "Neues Auto",
    "targetAmount": 15000,
    "currentAmount": 3500,
    "createdAt": "2026-01-12T09:45:00.000Z",
    "updatedAt": "2026-01-18T11:20:00.000Z",
    "__v": 0
  }
]
```

**Status Codes:**
- `200 OK` - Erfolgreiche Anfrage
- `500 Internal Server Error` - Datenbankfehler

---

### 2. Neues Sparziel erstellen

Erstellt ein neues Sparziel mit Zielbetrag.

**Endpoint:**
```
POST /api/savings-goals
```

**Request Body:**
```json
{
  "name": "Notfallreserve",
  "targetAmount": 10000,
  "currentAmount": 0
}
```

**Validierung:**
- `name` - **Pflichtfeld**, String, min. 1 Zeichen
- `targetAmount` - **Pflichtfeld**, Number, positiv
- `currentAmount` - Optional, Number, Standard: 0

**Response:**
```json
{
  "_id": "65b3d4e5f6g7h8i9j0k1l2m3",
  "name": "Notfallreserve",
  "targetAmount": 10000,
  "currentAmount": 0,
  "createdAt": "2026-01-21T14:00:00.000Z",
  "updatedAt": "2026-01-21T14:00:00.000Z",
  "__v": 0
}
```

**Status Codes:**
- `201 Created` - Sparziel erfolgreich erstellt
- `400 Bad Request` - Validierungsfehler
- `500 Internal Server Error` - Datenbankfehler

---

### 3. Sparziel aktualisieren

Aktualisiert den aktuellen Betrag eines Sparziels.

**Endpoint:**
```
PATCH /api/savings-goals/:id
```

**URL Parameter:**
- `id` - MongoDB ObjectId des Sparziels

**Request Body:**
```json
{
  "currentAmount": 2000.00
}
```

**Beispiel:**
```
PATCH /api/savings-goals/65b1c2d3e4f5g6h7i8j9k0l1
```

**Response:**
```json
{
  "_id": "65b1c2d3e4f5g6h7i8j9k0l1",
  "name": "Sommerurlaub",
  "targetAmount": 5000,
  "currentAmount": 2000,
  "createdAt": "2026-01-10T12:00:00.000Z",
  "updatedAt": "2026-01-22T16:45:00.000Z",
  "__v": 0
}
```

**Hinweis:** Der Betrag wird absolut gesetzt, nicht addiert!

**Status Codes:**
- `200 OK` - Sparziel erfolgreich aktualisiert
- `400 Bad Request` - Validierungsfehler
- `404 Not Found` - Sparziel nicht gefunden
- `500 Internal Server Error` - Datenbankfehler

---

### 4. Sparziel löschen

Löscht ein bestehendes Sparziel anhand seiner ID.

**Endpoint:**
```
DELETE /api/savings-goals/:id
```

**URL Parameter:**
- `id` - MongoDB ObjectId des Sparziels

**Beispiel:**
```
DELETE /api/savings-goals/65b1c2d3e4f5g6h7i8j9k0l1
```

**Response:**
```json
{
  "message": "Sparziel erfolgreich gelöscht",
  "deletedId": "65b1c2d3e4f5g6h7i8j9k0l1"
}
```

**Status Codes:**
- `200 OK` - Sparziel erfolgreich gelöscht
- `404 Not Found` - Sparziel nicht gefunden
- `500 Internal Server Error` - Datenbankfehler

---

## 📊 Datenmodelle

### Transaction Schema

```javascript
{
  text: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Felder:**
| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `_id` | ObjectId | Auto | MongoDB ID |
| `text` | String | Ja | Beschreibung der Transaktion |
| `amount` | Number | Ja | Betrag (positiv) |
| `type` | String | Ja | "income" oder "expense" |
| `createdAt` | Date | Auto | Erstellungszeitpunkt |
| `updatedAt` | Date | Auto | Letzte Änderung |

---

### SavingsGoal Schema

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Felder:**
| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `_id` | ObjectId | Auto | MongoDB ID |
| `name` | String | Ja | Name des Sparziels |
| `targetAmount` | Number | Ja | Zielbetrag |
| `currentAmount` | Number | Nein | Aktueller Betrag (Standard: 0) |
| `createdAt` | Date | Auto | Erstellungszeitpunkt |
| `updatedAt` | Date | Auto | Letzte Änderung |

---

## ⚠️ Fehlerbehandlung

### Allgemeine Fehlerstruktur

```json
{
  "error": "Fehlermeldung",
  "details": "Zusätzliche Details (optional)"
}
```

### Häufige Fehler

#### 400 Bad Request
```json
{
  "error": "Validierungsfehler",
  "details": "Feld 'amount' muss eine positive Zahl sein"
}
```

**Ursachen:**
- Fehlende Pflichtfelder
- Ungültige Datentypen
- Enum-Verletzung (z.B. type muss "income" oder "expense" sein)

---

#### 404 Not Found
```json
{
  "error": "Ressource nicht gefunden",
  "details": "Transaktion mit ID 65a1b2c3... existiert nicht"
}
```

**Ursachen:**
- Ungültige oder nicht existierende ID
- Ressource wurde bereits gelöscht

---

#### 500 Internal Server Error
```json
{
  "error": "Interner Serverfehler",
  "details": "Datenbankverbindung fehlgeschlagen"
}
```

**Ursachen:**
- Datenbankverbindung unterbrochen
- MongoDB-Fehler
- Unerwartete Server-Probleme

---

## 🧪 Beispiel-Requests

### Mit cURL

#### Alle Transaktionen abrufen
```bash
curl -X GET http://localhost:5000/api/transactions
```

#### Neue Transaktion erstellen
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Gehalt",
    "amount": 5000,
    "type": "income"
  }'
```

#### Transaktion löschen
```bash
curl -X DELETE http://localhost:5000/api/transactions/65a1b2c3d4e5f6g7h8i9j0k1
```

#### Sparziel aktualisieren
```bash
curl -X PATCH http://localhost:5000/api/savings-goals/65b1c2d3e4f5g6h7i8j9k0l1 \
  -H "Content-Type: application/json" \
  -d '{
    "currentAmount": 2500
  }'
```

---

### Mit JavaScript (Fetch API)

#### GET - Transaktionen laden
```javascript
const response = await fetch('http://localhost:5000/api/transactions');
const transactions = await response.json();
console.log(transactions);
```

#### POST - Transaktion erstellen
```javascript
const response = await fetch('http://localhost:5000/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Einkaufen',
    amount: 85.50,
    type: 'expense'
  })
});
const newTransaction = await response.json();
```

#### DELETE - Transaktion löschen
```javascript
const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
  method: 'DELETE'
});
const result = await response.json();
```

#### PATCH - Sparziel aktualisieren
```javascript
const response = await fetch(`http://localhost:5000/api/savings-goals/${id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    currentAmount: 1500
  })
});
const updatedGoal = await response.json();
```

---

### Mit Axios (wie in der App verwendet)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// GET
const transactions = await axios.get(`${API_URL}/transactions`);

// POST
const newTransaction = await axios.post(`${API_URL}/transactions`, {
  text: 'Gehalt',
  amount: 5000,
  type: 'income'
});

// PATCH
const updatedGoal = await axios.patch(`${API_URL}/savings-goals/${id}`, {
  currentAmount: 2000
});

// DELETE
await axios.delete(`${API_URL}/transactions/${id}`);
```

---

## 🔐 CORS-Konfiguration

Das Backend erlaubt Requests vom Frontend:

```javascript
// In server.js
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));
```

**Erlaubte Origins:**
- `http://localhost:3000` (React Development Server)

---

## 📊 API-Übersicht

| Endpoint | Methode | Beschreibung | Body |
|----------|---------|--------------|------|
| `/transactions` | GET | Alle Transaktionen | - |
| `/transactions` | POST | Neue Transaktion | text, amount, type |
| `/transactions/:id` | DELETE | Transaktion löschen | - |
| `/savings-goals` | GET | Alle Sparziele | - |
| `/savings-goals` | POST | Neues Sparziel | name, targetAmount |
| `/savings-goals/:id` | PATCH | Sparziel aktualisieren | currentAmount |
| `/savings-goals/:id` | DELETE | Sparziel löschen | - |

---

## 🧪 Testing

### Mit Postman

1. Postman öffnen
2. Collection erstellen: "Budget Tracker API"
3. Requests für alle Endpoints hinzufügen
4. Umgebungsvariable setzen: `{{base_url}} = http://localhost:5000/api`

### Mit Thunder Client (VS Code Extension)

1. Thunder Client Extension installieren
2. New Request erstellen
3. URL: `http://localhost:5000/api/transactions`
4. Method auswählen (GET, POST, etc.)
5. Bei POST/PATCH: Body → JSON auswählen und Daten eingeben

---

## 📝 Hinweise

### Best Practices
- Immer `Content-Type: application/json` Header setzen
- Bei POST/PATCH immer valides JSON senden
- IDs müssen gültige MongoDB ObjectIds sein (24 Hex-Zeichen)
- Beträge immer als Number, nicht als String

### Bekannte Limitierungen
- Keine Authentifizierung (für Produktionsumgebung hinzufügen)
- Keine Pagination (alle Daten werden zurückgegeben)
- Keine Rate-Limiting
- CORS nur für localhost:3000

### Zukünftige Erweiterungen
- User Authentication (JWT)
- Pagination für große Datenmengen
- Filtering & Sorting über Query-Parameter
- Kategorien für Transaktionen
- Budget-Limits und Warnungen

---

**Für Fragen zur API-Nutzung siehe auch:** [TECHNICAL.md](TECHNICAL.md)