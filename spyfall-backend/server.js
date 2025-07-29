const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');
const realTimeService = require('./realTimeService');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://localhost:8000";
const DB_HOST = process.env.DB_HOST;

// Middleware
app.use(bodyParser.json());
// app.use(cors({
//   origin: FRONTEND_URL,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));

app.use(cors({
  origin: "*", 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));


// Routes
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB
mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Initialize real-time service
const io = socketIo(server, {
  cors: {
    origin: "*", // your frontend port
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);
});

realTimeService.initialize(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
