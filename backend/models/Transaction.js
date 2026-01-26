import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true }, // Einnahme oder Ausgabe
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);