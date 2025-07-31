const mongoose = require('mongoose');

const adQuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ['en', 'ar'],
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 2 options'],
  },
  url: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active',
  },
}, {
  timestamps: true,
});

function arrayLimit(val) {
  return val.length === 2;
}

const AdQuestion = mongoose.model('AdQuestion', adQuestionSchema);

module.exports = AdQuestion;
