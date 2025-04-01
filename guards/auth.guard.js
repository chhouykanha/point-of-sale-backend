const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const authGuard = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies?.token  ||
                  (req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1])

    if (!token) {
      return res.status(401).json({ error: 'Authentication Invalid: No token provided!' });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(payload.userId)

    req.user = user

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ error: 'Authentication Invalid: Token verification failed!' });
  }
};

module.exports = authGuard;
