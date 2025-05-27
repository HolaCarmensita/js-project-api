import express from 'express';

const router = express.Router();

//kontroller funtkioner/handalers?
function listAllThoughts(req, res) {
  // Här skulle du hämta alla tankar från databasen
  res.json({ message: 'List of all thoughts' });
}
