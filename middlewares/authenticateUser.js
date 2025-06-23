import User from '../models/Users.js';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const accessToken = authHeader.replace('Bearer ', '');

  try {
    const user = await User.findOne({ accessToken });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Internal server error', details: err.message });
  }
};

export default authenticateUser;
