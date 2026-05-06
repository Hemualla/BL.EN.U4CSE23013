import axios from "axios";

// Point to the evaluation server's notification API
const api = axios.create({
  baseURL: "http://20.207.122.201/evaluation-service",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
