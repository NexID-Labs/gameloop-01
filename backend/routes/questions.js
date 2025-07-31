const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get questions by language
router.get('/language/:lang', async (req, res) => {
  try {
    const questions = await Question.find({ language: req.params.lang });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new question
router.post('/', async (req, res) => {
  const question = new Question({
    text: req.body.text,
    language: req.body.language,
    options: req.body.options,
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a question
router.put('/:id', async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        language: req.body.language,
        options: req.body.options,
      },
      { new: true }
    );
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a question
router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
