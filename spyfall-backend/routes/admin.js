const express = require('express');
const Question = require('../models/Question');
const Ad = require('../models/Ad');

const router = express.Router();

// Add a new question
router.post('/questions', async (req, res) => {
  const { question, options } = req.body;

  try {
    const newQuestion = new Question({ question, options });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update a question
router.put('/questions/:id', async (req, res) => {
  const { question, options } = req.body;

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete a question
router.delete('/questions/:id', async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Add a new ad
router.post('/ads', async (req, res) => {
  const { title, content, url, image, status } = req.body;

  try {
    const newAd = new Ad({ title, content, url, image, status });
    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get all ads
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ad.find();
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update an ad
router.put('/ads/:id', async (req, res) => {
  const { title, content, url, image, status } = req.body;

  try {
    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      { title, content, url, image, status },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.status(200).json(updatedAd);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete an ad
router.delete('/ads/:id', async (req, res) => {
  try {
    const deletedAd = await Ad.findByIdAndDelete(req.params.id);

    if (!deletedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
