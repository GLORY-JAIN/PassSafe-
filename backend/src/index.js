// Basic Express server setup for PassSafe backend
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('PassSafe backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
