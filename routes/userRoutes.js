import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';

const userRoutes = express.Router();

userRoutes.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kontrollera att email och password finns
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Kolla om användaren redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hasha lösenordet
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Skapa användaren
    const newUser = await new User({ email, password: hashedPassword }).save();

    // Skicka tillbaka accessToken + email
    res.status(201).json({
      email: newUser.email,
      accessToken: newUser.accessToken,
      id: newUser._id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message });
  }
});

export default userRoutes;
