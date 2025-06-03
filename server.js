import cors from 'cors';
import express from 'express';
import expressListEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';
import happyRouter from './routes/happyThoughts.js';
import mongoose from 'mongoose';
import { Thought } from './models/Thought.js';

// Ladda in .env-filen
dotenv.config();

//Mongoose setup
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl);
mongoose.connection.on('connected', () => console.log('MongoDB connected'));

const port = process.env.PORT || 8080;

// Skapa en Express-app
const app = express();

// Middleware
app.use(cors()); // Aktivera CORS
app.use(express.json()); // Aktivera JSON-parsing

// Rot-endpoint: lista alla endpoints requriement
function ListEndpointsHandler(req, res) {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
}
app.get('/', ListEndpointsHandler);

//HappyRouter montering
app.use('/api/thoughts', happyRouter);

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
