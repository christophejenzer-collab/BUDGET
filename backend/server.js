// =======================
// Imports
// =======================
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// =======================
// Config
// =======================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// =======================
// Middlewares
// =======================
app.use(cors());
app.use(express.json());

// =======================
// Debug ENV
// =======================
console.log('🔍 MONGO_URI:', MONGO_URI ? 'OK (geladen)' : 'NICHT GELADEN');

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas verbunden');

    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Verbindungsfehler:', err.message);
  });

// =======================
// Test Route
// =======================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend läuft' });
});

// =======================
// Routes
// =======================
// 👉 Passe die Pfade an, falls deine Ordner anders heißen
import transactionRoutes from './routes/transactions.js';
import savingsGoalRoutes from './routes/savingsGoals.js';

app.use('/api/transactions', transactionRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
