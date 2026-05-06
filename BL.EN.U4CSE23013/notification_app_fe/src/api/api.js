import axios from "axios";

// All requests go through the local backend proxy at localhost:5000/eval
// The backend handles authentication with the evaluation server.
// No token needed here — backend manages it with auto-refresh.
const api = axios.create({
  baseURL: "http://localhost:5000/eval",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
