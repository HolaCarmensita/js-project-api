import cors from 'cors';
import express from 'express';
import expressListEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';

// Ladda in .env-filen
dotenv.config();
const port = process.env.PORT || 8080;

// Skapa en Express-app
const app = express();

// Middleware
app.use(cors()); // Aktivera CORS
app.use(express.json()); // Aktivera JSON-parsing

// 1) Dina vanliga routes
app.get('/', (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});
// Exempel på fler routes
app.post('/thoughts', (req, res) => {
  // ... lägg till ny todo
});
app.get('/thoughts', (req, res) => {
  // ... returnera alla todos
});
app.get('/thoughts/:id', (req, res) => {
  // ... returnera todo med id
});

// Hantera 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

//Felhantering
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Starta servern
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
