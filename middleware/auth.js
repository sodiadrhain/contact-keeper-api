const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const header = req.header('x-auth-token');
  if (!header) return res.status(400).json({ msg: 'Unauthorized, No Token' });

  try {
    const decoded = jwt.verify(header, config.get('jwtSecret'));
    if (!decoded) res.status(404).json({ msg: 'Invalid Token' });
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server Error' });
  }
};
