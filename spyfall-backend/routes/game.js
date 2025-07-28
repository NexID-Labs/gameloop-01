const express = require('express');
const Game = require('../models/Game');
const realTimeService = require('../realTimeService');

const router = express.Router();

// Create a new game
router.post('/create', async (req, res) => {
  const { code } = req.body;

  try {
    const newGame = new Game({ code, host: null });
    await newGame.save();

    // Notify all players in the game
    if (realTimeService.io) {
      realTimeService.io.emit('gameCreated', newGame);
    }

    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Join a game
router.post('/join', async (req, res) => {
  const { code } = req.body;

  try {
    const game = await Game.findOne({ code });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.players.push(null);
    await game.save();

    // Notify all players in the game
    if (realTimeService.io) {
      realTimeService.io.to(code).emit('playerJoined', { playerId: null });
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get game details
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const game = await Game.findOne({ code });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update game question limit
router.put('/:code/questionLimit', async (req, res) => {
  const { code } = req.params;
  const { questionLimit } = req.body;

  try {
    const game = await Game.findOne({ code });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.questionLimit = questionLimit;
    await game.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update game question count
router.put('/:code/questionCount', async (req, res) => {
  const { code } = req.params;
  const { questionCount } = req.body;

  try {
    const game = await Game.findOne({ code });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.questionCount = questionCount;
    await game.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Start a game
router.post('/:code/start', async (req, res) => {
  const { code } = req.params;
  const { startTime, duration } = req.body;

  try {
    const game = await Game.findOne({ code });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.gameStarted = true;
    game.startTime = startTime;
    game.duration = duration;
    await game.save();

    // Notify all players in the game
    if (realTimeService.io) {
      realTimeService.io.to(code).emit('gameStarted', game);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// End a game
router.post('/:code/end', async (req, res) => {
  const { code } = req.params;

  try {
    const game = await Game.findOne({ code });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.gameEnded = true;
    await game.save();

    // Notify all players in the game
    if (realTimeService.io) {
      realTimeService.io.to(code).emit('gameEnded', game);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete a game
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json({ success: true, message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
