import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import useNotifications from "../hooks/useNotifications";

const AllNotifications = () => {
  const [filter, setFilter] = useState("");
  const [readStatus, setReadStatus] = useState({});

  const { notifications, loading, error } = useNotifications({
    notification_type: filter || undefined,
    limit: 50,
  });

  const handleToggleRead = (id) => {
    setReadStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          All Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View all campus notifications — Events, Results, and Placements
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <FilterBar activeFilter={filter} onFilterChange={setFilter} />
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && notifications.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No notifications found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {filter
              ? `No ${filter} notifications available`
              : "Check back later for updates"}
          </Typography>
        </Paper>
      )}

      {/* Notifications List */}
      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={2}>
          {notifications.map((notif) => (
            <NotificationCard
              key={notif.ID}
              notification={notif}
              isRead={readStatus[notif.ID] || false}
              onToggleRead={handleToggleRead}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default AllNotifications;
