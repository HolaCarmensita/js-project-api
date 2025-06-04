import cors from 'cors';
import express from 'express';
import expressListEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';
import happyRouter from './routes/happyThoughts.js';
import mongoose from 'mongoose';
import data from './data.json';
import { Thought } from './models/Thoughts.js';

// Ladda in .env-filen
dotenv.config();

//moongoose
const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/happyThoughts';
mongoose.connect(mongoUrl);
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));

const port = process.env.PORT || 8080;

// const seedDatabase = async () => {
//   try {
//     await Thought.deleteMany(); // Rensa tidigare innehåll
//     await Thought.insertMany(data); // in med nya tankar
//     console.log('Database seeded with thoughts!');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   }
// };

// seedDatabase();

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
