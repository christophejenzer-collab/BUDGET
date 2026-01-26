# 🚀 Setup & Installation

Schritt-für-Schritt Anleitung zur Installation und Einrichtung des Budget Trackers.

---

## 📋 Inhaltsverzeichnis

- [Systemanforderungen](#systemanforderungen)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Backend einrichten](#backend-einrichten)
- [Frontend einrichten](#frontend-einrichten)
- [Starten der Applikation](#starten-der-applikation)
- [Troubleshooting](#troubleshooting)

---

## 💻 Systemanforderungen

### Erforderliche Software

| Software | Mindestversion | Download |
|----------|----------------|----------|
| Node.js | 16.x oder höher | [nodejs.org](https://nodejs.org) |
| npm | 8.x oder höher | Kommt mit Node.js |
| Git | 2.x oder höher | [git-scm.com](https://git-scm.com) |

### Optional

- **MongoDB Compass** - GUI für MongoDB (optional)
- **Postman** - API-Testing (optional)
- **VS Code** - Empfohlener Code-Editor

### System-Check

```bash
# Node.js Version prüfen
node --version
# Sollte v16.x.x oder höher sein

# npm Version prüfen
npm --version
# Sollte 8.x.x oder höher sein

# Git Version prüfen
git --version
# Sollte 2.x.x oder höher sein
```

---

## 🍃 MongoDB Atlas Setup

### 1. Account erstellen

1. Gehe zu [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Klicke auf **"Try Free"**
3. Registriere dich mit E-Mail oder Google-Account

### 2. Cluster erstellen

1. Nach dem Login: **"Build a Database"** klicken
2. **Free Tier (M0)** auswählen
3. Cloud Provider: **AWS** (empfohlen)
4. Region: Wähle die nächstgelegene Region (z.B. Frankfurt)
5. Cluster Name: `BudgetTracker` (oder beliebig)
6. **"Create"** klicken

⏱️ **Wartezeit:** 3-5 Minuten bis Cluster bereit ist

### 3. Database User erstellen

1. In der Sidebar: **"Database Access"** klicken
2. **"Add New Database User"** klicken
3. Authentication Method: **"Password"**
4. Username: `budgetuser` (oder beliebig)
5. Password: Sicheres Passwort generieren und **speichern!**
6. Database User Privileges: **"Read and write to any database"**
7. **"Add User"** klicken

### 4. Network Access konfigurieren

1. In der Sidebar: **"Network Access"** klicken
2. **"Add IP Address"** klicken
3. **"Allow Access from Anywhere"** klicken (0.0.0.0/0)
4. **"Confirm"** klicken

⚠️ **Hinweis:** Nur für Entwicklung! In Produktion spezifische IPs erlauben.

### 5. Connection String erhalten

1. Zurück zu **"Database"** in der Sidebar
2. Bei deinem Cluster auf **"Connect"** klicken
3. **"Connect your application"** wählen
4. Driver: **"Node.js"**, Version: **"4.1 or later"**
5. Connection String kopieren:

```
mongodb+srv://budgetuser:<password>@budgettracker.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. `<password>` durch dein tatsächliches Passwort ersetzen!

---

## 🖥️ Backend einrichten

### 1. Repository klonen

```bash
# Repository klonen
git clone https://github.com/dein-username/budget-tracker.git

# In Projekt-Verzeichnis wechseln
cd budget-tracker
```

### 2. Backend-Dependencies installieren

```bash
# In Backend-Ordner wechseln
cd backend

# Dependencies installieren
npm install
```

**Installierte Packages:**
- `express` - Web Framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Umgebungsvariablen

### 3. Umgebungsvariablen konfigurieren

Erstelle eine `.env` Datei im `backend/` Ordner:

```bash
# Im backend/ Ordner
touch .env
```

Füge folgende Zeilen hinzu:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://budgetuser:DEIN_PASSWORT@budgettracker.xxxxx.mongodb.net/budget-tracker?retryWrites=true&w=majority

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

⚠️ **Wichtig:** Ersetze `DEIN_PASSWORT` mit deinem echten MongoDB-Passwort!

### 4. Backend-Struktur prüfen

Stelle sicher, dass diese Struktur vorhanden ist:

```
backend/
├── models/
│   ├── SavingsGoal.js
│   └── Transaction.js
├── routes/
│   ├── savingsGoals.js
│   └── transactions.js
├── server.js
├── package.json
└── .env
```

### 5. Backend starten

```bash
# Im backend/ Ordner
npm start
```

**Erwartete Ausgabe:**
```
Server läuft auf Port 5000
MongoDB verbunden!
```

✅ **Backend läuft jetzt auf:** `http://localhost:5000`

---

## ⚛️ Frontend einrichten

### 1. Frontend-Dependencies installieren

```bash
# In einem neuen Terminal
cd budget-tracker/frontend

# Dependencies installieren
npm install
```

**Installierte Packages:**
- `react` - UI Library
- `react-dom` - React Rendering
- `axios` - HTTP Client
- `react-scripts` - Build Tools

### 2. API-URL prüfen

Öffne `frontend/src/components/Dashboard.js` und prüfe die API_URL:

```javascript
const API_URL = 'http://localhost:5000/api';
```

✅ Sollte auf Port 5000 zeigen (Backend-Port)

### 3. Frontend starten

```bash
# Im frontend/ Ordner
npm start
```

**Erwartete Ausgabe:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

🎉 **Frontend läuft jetzt auf:** `http://localhost:3000`

Browser öffnet automatisch!

---

## 🎮 Starten der Applikation

### Vollständiger Start (beide Services)

Du benötigst **2 Terminal-Fenster**:

#### Terminal 1 - Backend
```bash
cd budget-tracker/backend
npm start
```

#### Terminal 2 - Frontend
```bash
cd budget-tracker/frontend
npm start
```

### Mit npm-scripts (Alternative)

Wenn du im Root-Verzeichnis ein `package.json` mit Concurrently hast:

```bash
# Im Root-Verzeichnis
npm run dev
```

Dies startet Backend und Frontend gleichzeitig.

---

## ✅ Funktionstest

### 1. Backend testen

Öffne einen Browser oder Postman und teste:

```
GET http://localhost:5000/api/transactions
```

**Erwartete Antwort:**
```json
[]
```
(Leeres Array, da noch keine Daten vorhanden)

### 2. Frontend testen

1. Öffne `http://localhost:3000`
2. Du solltest das Dashboard sehen
3. Teste: Neue Transaktion hinzufügen
   - Beschreibung: "Test"
   - Betrag: 100
   - Typ: Einnahme
   - "Hinzufügen" klicken
4. Die Transaktion sollte in der Liste erscheinen

### 3. Datenbank prüfen (optional)

Mit MongoDB Compass:
1. Verbinde mit deinem Connection String
2. Öffne Database: `budget-tracker`
3. Collections: `transactions` und `savingsgoals`
4. Du solltest deine Test-Daten sehen

---

## 🐛 Troubleshooting

### Backend startet nicht

#### Problem: Port bereits belegt
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Lösung:**
```bash
# Port-Belegung prüfen (Mac/Linux)
lsof -i :5000

# Port-Belegung prüfen (Windows)
netstat -ano | findstr :5000

# Prozess beenden oder anderen Port verwenden
# In .env ändern: PORT=5001
```

#### Problem: MongoDB Connection Error
```
MongooseError: Could not connect to any servers
```

**Lösungsschritte:**
1. Prüfe Connection String in `.env`
2. Passwort korrekt? (keine `<` `>` Klammern!)
3. Netzwerk-Zugriff in MongoDB Atlas erlaubt?
4. Internet-Verbindung aktiv?

**Test-Connection:**
```javascript
// In backend/server.js temporär hinzufügen
console.log('MongoDB URI:', process.env.MONGODB_URI);
```

---

### Frontend startet nicht

#### Problem: Port 3000 bereits belegt
```
? Something is already running on port 3000.
```

**Lösung:**
- Mit "Y" bestätigen um anderen Port zu verwenden (z.B. 3001)
- Oder Port 3000 freigeben

#### Problem: API-Requests schlagen fehl
```
Network Error / CORS Error
```

**Lösungsschritte:**
1. Backend läuft? (Check `http://localhost:5000`)
2. CORS in `backend/server.js` konfiguriert?
3. API_URL in Dashboard.js korrekt?

**CORS Fix (backend/server.js):**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

---

### MongoDB Atlas Probleme

#### Problem: User authentication failed
```
MongoServerError: Authentication failed
```

**Lösung:**
- Username und Passwort in `.env` prüfen
- Sonderzeichen im Passwort? URL-encode verwenden
- Beispiel: `!` wird zu `%21`, `@` wird zu `%40`

#### Problem: Connection timed out
```
MongooseServerSelectionError: connection timed out
```

**Lösung:**
- Firewall-Einstellungen prüfen
- VPN deaktivieren (falls aktiv)
- Network Access in MongoDB Atlas: IP erlaubt?

---

### Allgemeine Probleme

#### Problem: npm install schlägt fehl

**Lösung:**
```bash
# Cache leeren
npm cache clean --force

# node_modules löschen und neu installieren
rm -rf node_modules package-lock.json
npm install
```

#### Problem: Alte Version läuft

**Lösung:**
```bash
# Frontend
# Ctrl+C zum Beenden, dann:
npm start

# Backend
# Ctrl+C zum Beenden, dann:
npm start
```

Browser-Cache leeren: Ctrl+Shift+R (Windows/Linux) oder Cmd+Shift+R (Mac)

---

## 🔧 Development-Tipps

### Nodemon für Auto-Restart (Backend)

```bash
# Global installieren
npm install -g nodemon

# Oder als Dev-Dependency
cd backend
npm install --save-dev nodemon
```

**package.json anpassen:**
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

**Verwenden:**
```bash
npm run dev
```

Backend startet automatisch neu bei Code-Änderungen!

### React DevTools

Browser-Extension installieren:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### VS Code Extensions (empfohlen)

- **ES7+ React/Redux/React-Native snippets**
- **ESLint**
- **Prettier**
- **MongoDB for VS Code**
- **Thunder Client** (API-Testing)

---

## 📚 Nächste Schritte

Nach erfolgreicher Installation:

1. 📖 Lies die [FEATURES.md](FEATURES.md) für Feature-Details
2. 📡 Schaue dir [API_DOCUMENTATION.md](API_DOCUMENTATION.md) an
3. 🏗️ Verstehe die Architektur in [TECHNICAL.md](TECHNICAL.md)
4. 📝 Folge dem Entwicklungsprozess in [JOURNAL.md](JOURNAL.md)

---

## 🆘 Weitere Hilfe

Bei Problemen:
1. Console-Output im Terminal prüfen
2. Browser DevTools Console öffnen (F12)
3. MongoDB Atlas Logs prüfen
4. GitHub Issues durchsuchen

---

**Happy Coding! 🚀**