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

userRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Leta upp användaren
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Jämför lösenord
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Om allt ok! Skicka tillbaka accessToken
    res.status(200).json({
      email: user.email,
      accessToken: user.accessToken,
      id: user._id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message });
  }
});

export default userRoutes;
