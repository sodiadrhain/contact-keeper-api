const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   Post api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name cannot be empty').not().isEmpty(),
    check('password', 'Password cannot be empty').isLength({ min: 5 }),
    check('email', 'Must be a valid Email').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    const { name, password, email } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name: name,
        email: email,
        password: password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, data) => {
          if (err) throw err;
          res.json({ user, token: data });
        }
      );
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
      console.error(err.message);
    }
  }
);

module.exports = router;
