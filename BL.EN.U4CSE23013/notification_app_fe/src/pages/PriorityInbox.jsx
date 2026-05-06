import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  Slider,
  Chip,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import { fetchNotifications } from "../services/notificationService";
import { getTopNPriority } from "../utils/priorityAlgorithm";

const PriorityInbox = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);
  const [filter, setFilter] = useState("");
  const [readStatus, setReadStatus] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch a large batch so we can compute priority client-side
        const data = await fetchNotifications({ limit: 100 });
        setAllNotifications(data);
      } catch (err) {
        setError("Failed to load notifications from evaluation server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggleRead = (id) => {
    setReadStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Apply type filter first, then compute priority
  const filtered = filter
    ? allNotifications.filter((n) => n.Type === filter)
    : allNotifications;

  const priorityNotifications = getTopNPriority(filtered, topN);

  const weightCounts = {
    Placement: priorityNotifications.filter((n) => n.Type === "Placement").length,
    Result: priorityNotifications.filter((n) => n.Type === "Result").length,
    Event: priorityNotifications.filter((n) => n.Type === "Event").length,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <StarIcon sx={{ color: "#f59e0b", fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>
            Priority Inbox
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Top notifications ranked by importance — Placements first, then Results, then Events.
          Within the same type, most recent appear first.
        </Typography>
      </Box>

      {/* Controls */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          {/* Filter */}
          <FilterBar activeFilter={filter} onFilterChange={setFilter} />

          <Divider />

          {/* Top-N Slider */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Show top{" "}
              <Chip
                label={topN}
                size="small"
                sx={{ backgroundColor: "#1a1a2e", color: "white", fontWeight: 700 }}
              />{" "}
              notifications
            </Typography>
            <Slider
              value={topN}
              min={5}
              max={20}
              step={5}
              marks={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
                { value: 20, label: "20" },
              ]}
              onChange={(e, val) => setTopN(val)}
              sx={{
                color: "#1a1a2e",
                maxWidth: 400,
                "& .MuiSlider-markLabel": { fontSize: "0.75rem" },
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Priority Breakdown */}
      {!loading && priorityNotifications.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Chip
            icon={<WorkIcon />}
            label={`${weightCounts.Placement} Placements`}
            sx={{ backgroundColor: "#fff3e0", color: "#e65100", fontWeight: 600 }}
          />
          <Chip
            icon={<EmojiEventsIcon />}
            label={`${weightCounts.Result} Results`}
            sx={{ backgroundColor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }}
          />
          <Chip
            icon={<EventIcon />}
            label={`${weightCounts.Event} Events`}
            sx={{ backgroundColor: "#e3f2fd", color: "#1565c0", fontWeight: 600 }}
          />
        </Box>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty */}
      {!loading && !error && priorityNotifications.length === 0 && (
        <Paper
          elevation={0}
          sx={{ p: 6, textAlign: "center", backgroundColor: "#f9f9f9" }}
        >
          <Typography variant="h6" color="text.secondary">
            No priority notifications found
          </Typography>
        </Paper>
      )}

      {/* Priority List */}
      {!loading && !error && priorityNotifications.length > 0 && (
        <Stack spacing={2}>
          {priorityNotifications.map((notif, index) => (
            <Box key={notif.ID} sx={{ position: "relative" }}>
              {/* Rank badge */}
              <Chip
                label={`#${index + 1}`}
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 1,
                  backgroundColor:
                    index === 0
                      ? "#f59e0b"
                      : index === 1
                      ? "#9e9e9e"
                      : index === 2
                      ? "#cd7f32"
                      : "#e0e0e0",
                  color: index < 3 ? "white" : "#555",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                }}
              />
              <NotificationCard
                notification={notif}
                isRead={readStatus[notif.ID] || false}
                onToggleRead={handleToggleRead}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default PriorityInbox;
