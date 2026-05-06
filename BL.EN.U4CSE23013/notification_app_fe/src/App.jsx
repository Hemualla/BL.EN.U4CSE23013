import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Navbar from "./components/Navbar";
import AllNotifications from "./pages/AllNotifications";
import PriorityInbox from "./pages/PriorityInbox";

const theme = createTheme({
  palette: {
    primary: { main: "#1a1a2e" },
    secondary: { main: "#7c83fd" },
    background: { default: "#f4f6f9" },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
