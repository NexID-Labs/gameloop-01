const express = require('express');
const router = express.Router();
const AdQuestion = require('../models/AdQuestion');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Get all ad questions
router.get('/', async (req, res) => {
  try {
    const adQuestions = await AdQuestion.find();
    res.json(adQuestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get ad questions by language
router.get('/language/:lang', async (req, res) => {
  try {
    const adQuestions = await AdQuestion.find({ language: req.params.lang });
    res.json(adQuestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new ad question
router.post('/', upload.single('image'), async (req, res) => {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const adQuestion = new AdQuestion({
        text: req.body.text,
        language: req.body.language,
        options: JSON.parse(req.body.options),
        url: req.body.url,
        image: imageUrl,
        status: req.body.status,
    });

    try {
        const newAdQuestion = await adQuestion.save();
        res.status(201).json(newAdQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an ad question
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      text: req.body.text,
      language: req.body.language,
      options: JSON.parse(req.body.options),
      url: req.body.url,
      status: req.body.status,
    };

    // Handle image update
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedAdQuestion = await AdQuestion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedAdQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an ad question
router.delete('/:id', async (req, res) => {
  try {
    // Find the ad question to get the image path
    const adQuestion = await AdQuestion.findById(req.params.id);

    // Delete the ad question
    await AdQuestion.findByIdAndDelete(req.params.id);

    // If there was an image, delete the file
    if (adQuestion.image) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(adQuestion.image));
      try {
        await fs.promises.unlink(imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    res.json({ message: 'Ad question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
