const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
}, {
  timestamps: true,
});

function arrayLimit(val) {
  return val.length === 2;
}

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
