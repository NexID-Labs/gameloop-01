const socketIo = require('socket.io');
const Game = require('./models/Game');

let io;

const initialize = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join a game
    socket.on('joinGame', async (gameCode) => {
      try {
        const game = await Game.findOne({ code: gameCode });
        if (!game) {
          socket.emit('gameNotFound', { message: 'Game not found' });
          return;
        }

        socket.join(gameCode);
        console.log(`Client joined game: ${gameCode}`);

        // Send game data to the client
        socket.emit('gameData', game);

        // Notify other players in the game
        socket.to(gameCode).emit('playerJoined', { playerId: socket.id });
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', { message: 'Something went wrong' });
      }
    });

    // Start game
    socket.on('startGame', async (gameCode) => {
      try {
        const game = await Game.findOne({ code: gameCode });
        if (!game) {
          socket.emit('gameNotFound', { message: 'Game not found' });
          return;
        }

        game.gameStarted = true;
        await game.save();

        // Notify all players in the game
        io.to(gameCode).emit('gameStarted', game);
      } catch (error) {
        console.error('Error starting game:', error);
        socket.emit('error', { message: 'Something went wrong' });
      }
    });

    // End game
    socket.on('endGame', async (gameCode) => {
      try {
        const game = await Game.findOne({ code: gameCode });
        if (!game) {
          socket.emit('gameNotFound', { message: 'Game not found' });
          return;
        }

        game.gameEnded = true;
        await game.save();

        // Notify all players in the game
        io.to(gameCode).emit('gameEnded', game);
      } catch (error) {
        console.error('Error ending game:', error);
        socket.emit('error', { message: 'Something went wrong' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = {
  initialize,
  io,
};
