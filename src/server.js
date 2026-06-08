import dotenv from 'dotenv';
import app from './app.js';
import './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`GitHub Profile Analyzer running on port ${port}`);
});
