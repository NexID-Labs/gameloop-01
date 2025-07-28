const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');
const realTimeService = require('./realTimeService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:8000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://gamingtycoon25:ojNKo63pHY3FyVCD@spyfall.7qbq9pk.mongodb.net/?retryWrites=true&w=majority&appName=Spyfall', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Initialize real-time service
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

realTimeService.initialize(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
