import axios from "axios";

// All evaluation server calls go through the local backend proxy at /eval
// This avoids CORS issues from the browser hitting the external server directly.
const api = axios.create({
  baseURL: "http://localhost:5000/eval",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
