import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://social-media-app-txhv.onrender.com"  // Backend on render
      : "http://localhost:5000",                       // Local
  withCredentials: true,
});

export default api;
