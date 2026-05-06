import axios from "axios";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJibC5lbi51NGNzZTIzMDEzQGJsLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjQ0NDMsImlhdCI6MTc3ODA2MzU0MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjJjZjkwZTJhLTM5YzMtNDVlNC04YmU3LTlhNmMxZWVjMjU4ZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhlbWFudGggYWxsYSIsInN1YiI6ImFlYmMzMmIwLTc1OGQtNDgxMC05YjJlLTY5MzJmZjY4ZjQ3YiJ9LCJlbWFpbCI6ImJsLmVuLnU0Y3NlMjMwMTNAYmwuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJoZW1hbnRoIGFsbGEiLCJyb2xsTm8iOiJibC5lbi51NGNzZTIzMDEzIiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiYWViYzMyYjAtNzU4ZC00ODEwLTliMmUtNjkzMmZmNjhmNDdiIiwiY2xpZW50U2VjcmV0IjoicW1Ed1hXTXd2Tld1TllIWiJ9.NXCjlaTH3OhUVhvT6SCGwu78kGip0oBerYdU18QzWy4";

// Points to the local backend proxy which forwards to the evaluation server.
// Backend must be running on port 5000.
const api = axios.create({
  baseURL: "http://localhost:5000/eval",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export default api;
