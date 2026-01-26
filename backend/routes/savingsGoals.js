import express from 'express';
import SavingsGoal from '../models/SavingsGoal.js';

const router = express.Router();

// Alle Sparziele abrufen
router.get('/', async (req, res) => {
  try {
    const goals = await SavingsGoal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Neues Sparziel speichern
router.post('/', async (req, res) => {
  const goal = new SavingsGoal({
    name: req.body.name,
    targetAmount: req.body.targetAmount,
    currentAmount: req.body.currentAmount || 0
  });
  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// NEU: Sparbetrag aktualisieren (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const updatedGoal = await SavingsGoal.findByIdAndUpdate(
      req.params.id, 
      { currentAmount: req.body.currentAmount },
      { new: true }
    );
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// NEU: Sparziel löschen (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await SavingsGoal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sparziel gelöscht' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;