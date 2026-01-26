import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// GET: Alle Transaktionen holen
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // ?type=income oder ?type=expense
    
    let query = {};
    if (type) {
      query.type = type;
    }
    
    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Neue Transaktion speichern
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    text: req.body.text,
    amount: req.body.amount,
    type: req.body.type
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Transaktion löschen
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaktion gelöscht' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;