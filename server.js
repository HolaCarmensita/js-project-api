import cors from 'cors';
import express from 'express';
import expressListEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import happyRouter from './routes/happyThoughtsRouter.js';
import userRoutes from './routes/userRoutes.js';

// Ladda in .env-filen
dotenv.config();

//moongoose
const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/happyThoughts';
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

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
app.use('/', userRoutes);

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
