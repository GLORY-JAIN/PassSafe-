// Basic Express server setup for PassSafe backend
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const zxcvbn = require('zxcvbn');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Password schema/model
const passwordSchema = new mongoose.Schema({
  label: { type: String, required: true },
  password: { type: String, required: true },
  strength: { type: String, required: true },
});
const Password = mongoose.model('Password', passwordSchema);

// Helper: map zxcvbn score to label
function getStrengthLabel(score) {
  if (score <= 1) return 'Weak';
  if (score === 2) return 'Medium';
  return 'Strong';
}

// POST /api/passwords: Save password and return strength
app.post('/api/passwords', async (req, res) => {
  const { label, password } = req.body;
  if (!label || !password) {
    return res.status(400).json({ error: 'Label and password are required' });
  }
  const result = zxcvbn(password);
  const strength = getStrengthLabel(result.score);
  try {
    const saved = await Password.create({ label, password, strength });
    res.status(201).json({
      _id: saved._id,
      label: saved.label,
      password: '••••••••',
      strength: saved.strength,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save password' });
  }
});

// GET /api/passwords: Return all saved passwords
app.get('/api/passwords', async (req, res) => {
  try {
    const passwords = await Password.find().select('label strength');
    // Hide actual passwords for security
    const result = passwords.map((p) => ({
      _id: p._id,
      label: p.label,
      password: '••••••••',
      strength: p.strength,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passwords' });
  }
});

// DELETE /api/passwords/:id: Delete a password by ID
app.delete('/api/passwords/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Password.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Password not found' });
    }
    res.json({ message: 'Password deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete password' });
  }
});

// Health check route
app.get('/', (req, res) => {
  res.send('PassSafe backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
