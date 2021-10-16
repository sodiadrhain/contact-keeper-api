const express = require('express');
const router = express.Router();
const Contact = require('../models/Contacts');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// @route   Post api/contacts
// @desc    Create contact
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Contact name cannot be empty').not().isEmpty(),
      check('email', 'Contact email must be an email').isEmail(),
      check('phone', 'Contact phone number cannot be empty').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }
    const { name, email, phone, type } = req.body;
    try {
      let contact = Contact({
        user: req.user.id,
        name: name,
        email: email,
        phone: phone,
      });

      if (type) contact.type = type;

      await contact.save();

      res.json({ msg: 'Contact created', contact });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route   Get api/contacts
// @desc    Fetch user all contacts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let contact = await Contact.find({ user: req.user.id }).sort({ date: -1 });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   Get api/contacts
// @desc    Fetch a user contact
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.find({ _id: req.params.id, user: req.user.id });
    res.json(contact);
  } catch (err) {
    if (err.name === 'CastError')
      return res.status(404).json({ msg: 'Contact Not Found' });
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   Put api/contacts
// @desc    Update contact details
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let check = await Contact.find({ _id: req.params.id, user: req.user.id });
    if (check) {
      let contact = await Contact.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.json(contact);
    }
  } catch (err) {
    if (err.name === 'CastError')
      return res.status(404).json({ msg: 'Contact Not Found' });
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   Delete api/contacts
// @desc    Register a user
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let check = await Contact.find({ _id: req.params.id, user: req.user.id });
    return check;
    if (check) {
      await Contact.findByIdAndRemove(req.params.id);
      res.json({ msg: 'Contact Deleted' });
    }
  } catch (err) {
    if (err.name === 'CastError')
      return res.status(404).json({ msg: 'Contact Not Found' });
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
