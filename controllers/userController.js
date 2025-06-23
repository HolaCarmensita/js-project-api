import User from '../models/Users.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await new User({ email, password: hashedPassword }).save();
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
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
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
};

export const logout = async (req, res) => {
  try {
    req.user.accessToken = crypto.randomBytes(64).toString('hex');
    await req.user.save();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not log out', details: err.message });
  }
};
