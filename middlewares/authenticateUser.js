import User from '../models/User.js';

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization');

  try {
    const user = await User.findOne({ accessToken });

    if (!user) {
      return res.status(401).json({ error: 'Please log in' });
    }

    // Allt ok – lägg användaren i request-objektet
    req.user = user;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message });
  }
};

export default authenticateUser;
