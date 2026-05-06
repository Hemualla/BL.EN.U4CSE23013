import axios from "axios";

// Axios instance — baseURL points to local backend proxy.
// Backend forwards requests to the evaluation server.
const api = axios.create({
  baseURL: "http://localhost:5000/eval",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
