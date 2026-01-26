# 🐳 Docker Setup

Schnellstart-Anleitung für den Budget Tracker mit Docker.

---

## 📋 Voraussetzungen

- **Docker Desktop** installiert: [docker.com/get-started](https://www.docker.com/get-started)
- **Git** installiert (zum Klonen)

---

## 🚀 Schnellstart (3 Befehle)

```bash
# 1. Repository klonen
git clone https://github.com/christophejenzer-collab/BUDGET.git
cd BUDGET

# 2. MongoDB Connection String konfigurieren
# Kopiere backend/.env.example zu backend/.env
# Trage deinen MongoDB Atlas Connection String ein

# 3. Alles starten
docker-compose up
```

**Fertig!** 🎉

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🔧 Detaillierte Anleitung

### 1. MongoDB Atlas vorbereiten

**Option A: MongoDB Atlas (empfohlen)**

1. Gehe zu [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Erstelle einen kostenlosen Cluster (falls noch nicht vorhanden)
3. Kopiere den Connection String
4. Erstelle `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/budget-tracker?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

**Option B: Lokale MongoDB mit Docker**

Verwende die mitgelieferte MongoDB im Docker-Container:

```env
MONGODB_URI=mongodb://mongodb:27017/budget-tracker
PORT=5000
NODE_ENV=production
```

---

### 2. Container starten

```bash
# Im Hauptverzeichnis (wo docker-compose.yml liegt)

# Starten (detached mode - läuft im Hintergrund)
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Status prüfen
docker-compose ps
```

---

### 3. Anwendung öffnen

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **MongoDB:** localhost:27017 (nur bei lokaler MongoDB)

---

## 🛑 Container stoppen

```bash
# Stoppen
docker-compose down

# Stoppen + Volumes löschen (löscht MongoDB Daten!)
docker-compose down -v
```

---

## 🔄 Neu bauen nach Code-Änderungen

```bash
# Container neu bauen und starten
docker-compose up --build
```

---

## 🐛 Troubleshooting

### Problem: Port bereits belegt

```bash
# Andere Services auf Port 3000 oder 5000 stoppen
# Oder Ports in docker-compose.yml ändern:

ports:
  - "3001:3000"  # Statt 3000:3000
```

### Problem: MongoDB Connection Error

```bash
# .env Datei prüfen
cat backend/.env

# Connection String korrekt?
# - Username und Password eingesetzt?
# - Sonderzeichen URL-encoded? (! → %21, @ → %40)
```

### Problem: Container startet nicht

```bash
# Logs anzeigen
docker-compose logs backend
docker-compose logs frontend

# Container neu bauen
docker-compose build --no-cache
docker-compose up
```

---

## 📊 Docker Commands Übersicht

```bash
# Alle Container anzeigen
docker ps

# Logs eines Services
docker-compose logs backend
docker-compose logs frontend

# In Container-Shell einsteigen
docker-compose exec backend sh
docker-compose exec frontend sh

# Container neu starten
docker-compose restart backend

# Alles aufräumen
docker-compose down
docker system prune -a
```

---

## 🎯 Vorteile von Docker

✅ **Ein Befehl** startet alles  
✅ **Keine lokale Installation** von Node.js nötig  
✅ **Gleiche Umgebung** für alle (Entwickler, Dozent, Produktion)  
✅ **Isoliert** - keine Konflikte mit anderen Projekten  
✅ **Schnell** - einmal gebaut, immer starten  

---

## 📝 Nächste Schritte

Nach erfolgreichem Start:

1. ✅ Öffne http://localhost:3000
2. ✅ Erstelle Test-Transaktionen
3. ✅ Erstelle Test-Sparziele
4. ✅ Teste Such- und Filterfunktionen

---

## 🔐 Sicherheitshinweis

⚠️ **Niemals** die `.env` Datei mit echten Credentials committen!

Die `.gitignore` verhindert das automatisch:
```
.env
.env.local
```

---

## 📚 Weitere Ressourcen

- Docker Dokumentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- MongoDB Atlas: https://www.mongodb.com/docs/atlas

---

**Bei Fragen siehe auch:** [README.md](README.md) | [SETUP.md](SETUP.md)