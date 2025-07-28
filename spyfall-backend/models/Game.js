const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  gameStarted: { type: Boolean, default: false },
  gameEnded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  startTime: { type: Date },
  duration: { type: Number },
  questionLimit: { type: Number, default: 20 },
  questionCount: { type: Number, default: 0 },
  points: {
    type: Map,
    of: Number,
    default: {}
  },
  currentQuestion: {
    question: { type: String },
    options: [{ type: String }],
    askedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    selectedAnswer: { type: String },
    guesses: {
      type: Map,
      of: String,
      default: {}
    },
    completedPlayers: {
      type: Map,
      of: Boolean,
      default: {}
    },
    submissionOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    currentSubmissionIndex: { type: Number, default: 0 }
  },
  playersReady: {
    type: Map,
    of: Boolean,
    default: {}
  },
  winner: { type: String },
  finalScores: {
    type: Map,
    of: Number,
    default: {}
  }
});

module.exports = mongoose.model('Game', gameSchema);
