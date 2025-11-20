const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// 2️⃣ App Setup
dotenv.config();
const app = express();
app.use(express.json());

// 3️⃣ CORS MUST COME BEFORE ROUTES
app.use(cors({
  origin: "https://social-media-app-1-3nv9.onrender.com", // frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// 4️⃣ Database connect
connectDB();

// 5️⃣ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);

// 6️⃣ Socket.io Setup AFTER CORS
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://social-media-app-1-3nv9.onrender.com",
    methods: ["GET", "POST"],
  },
});
