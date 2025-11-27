const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
const app = express();

// 🔥 EXPRESS JSON
app.use(express.json());

// 🔥 CORS FIX
const allowedOrigins = [
  "http://localhost:3000",
   "https://social-media-app-txhv.onrender.com",
  // "https://social-media-app-txhv.onrender.com",
  // "https://social-media-app-1-3nv9.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.NODE_ENV === "production") {
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("CORS Not Allowed in Production"));
        }
      }
      return callback(null, true); // Allow all in development
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// DB CONNECT
connectDB();

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);

// SOCKET & SERVER
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on ${PORT}`));
