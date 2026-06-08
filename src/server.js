import dotenv from 'dotenv';
import app from './app.js';
import './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GitHub Profile Analyzer API is running 🚀"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`GitHub Profile Analyzer running on port ${port}`);
});
