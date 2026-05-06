import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{ backgroundColor: "#1a1a2e" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left — Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NotificationsIcon sx={{ color: "#7c83fd" }} />
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "white", letterSpacing: 0.5 }}
          >
            Campus Notifications
          </Typography>
          <Chip
            label="Live"
            size="small"
            sx={{
              backgroundColor: "#2e7d32",
              color: "white",
              fontSize: "0.65rem",
              height: 20,
            }}
          />
        </Box>

        {/* Right — Navigation */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<NotificationsIcon />}
            onClick={() => navigate("/")}
            variant={location.pathname === "/" ? "contained" : "text"}
            sx={{
              color: "white",
              backgroundColor:
                location.pathname === "/" ? "#7c83fd" : "transparent",
              "&:hover": { backgroundColor: "#7c83fd33" },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            All Notifications
          </Button>

          <Button
            startIcon={<StarIcon />}
            onClick={() => navigate("/priority")}
            variant={location.pathname === "/priority" ? "contained" : "text"}
            sx={{
              color: "white",
              backgroundColor:
                location.pathname === "/priority" ? "#f59e0b" : "transparent",
              "&:hover": { backgroundColor: "#f59e0b33" },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Priority Inbox
          </Button>

          <Button
            startIcon={<SettingsIcon />}
            onClick={() => navigate("/manage")}
            variant={location.pathname === "/manage" ? "contained" : "text"}
            sx={{
              color: "white",
              backgroundColor:
                location.pathname === "/manage" ? "#7c83fd" : "transparent",
              "&:hover": { backgroundColor: "#7c83fd33" },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Manage
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
