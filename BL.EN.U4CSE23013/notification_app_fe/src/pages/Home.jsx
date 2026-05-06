import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Stack,
  Paper,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import axios from "axios";

const LOCAL_API = "http://localhost:5000/api";

const Home = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [formData, setFormData] = useState({ title: "", message: "", type: "info" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch from local backend ──────────────────────────────────────────────
  const loadNotifications = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await axios.get(`${LOCAL_API}/notifications`);
      setNotifications(res.data.data || []);
    } catch (err) {
      setFetchError("Could not reach local backend. Make sure it is running on port 5000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.title.trim() || !formData.message.trim()) {
      setFormError("Title and message are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${LOCAL_API}/notifications`, formData);
      if (res.data.success) {
        setFormData({ title: "", message: "", type: "info" });
        setFormSuccess("Notification created successfully.");
        loadNotifications();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create notification.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await axios.delete(`${LOCAL_API}/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  // ── Mark as read ──────────────────────────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      const res = await axios.patch(`${LOCAL_API}/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Mark-read failed:", err.message);
    }
  };

  // ── Type chip colours ─────────────────────────────────────────────────────
  const typeColor = {
    info: { bg: "#e3f2fd", color: "#1565c0" },
    success: { bg: "#e8f5e9", color: "#2e7d32" },
    warning: { bg: "#fff3e0", color: "#e65100" },
    error: { bg: "#fce4ec", color: "#c62828" },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Manage Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create, view, and manage notifications stored in the local backend.
        </Typography>
      </Box>

      {/* Create Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AddCircleOutlineIcon sx={{ color: "#7c83fd" }} />
          <Typography variant="h6" fontWeight={600}>
            Create Notification
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Message"
              name="message"
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              required
              fullWidth
              multiline
              rows={3}
              size="small"
            />
            <FormControl size="small" sx={{ maxWidth: 200 }}>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
              >
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>

            {formError && <Alert severity="error">{formError}</Alert>}
            {formSuccess && <Alert severity="success">{formSuccess}</Alert>}

            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ backgroundColor: "#1a1a2e", "&:hover": { backgroundColor: "#2a2a4e" } }}
              >
                {submitting ? "Creating…" : "Create Notification"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Notifications List */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Local Notifications ({notifications.length})
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {fetchError && <Alert severity="warning" sx={{ mb: 2 }}>{fetchError}</Alert>}

      {!loading && !fetchError && notifications.length === 0 && (
        <Paper elevation={0} sx={{ p: 5, textAlign: "center", backgroundColor: "#f9f9f9" }}>
          <Typography color="text.secondary">No notifications yet. Create one above!</Typography>
        </Paper>
      )}

      {!loading && notifications.length > 0 && (
        <Stack spacing={2}>
          {notifications.map((notif) => {
            const tc = typeColor[notif.type] || typeColor.info;
            return (
              <Paper
                key={notif.id}
                elevation={notif.isRead ? 1 : 3}
                sx={{
                  p: 2,
                  borderLeft: `4px solid ${tc.color}`,
                  opacity: notif.isRead ? 0.65 : 1,
                  transition: "all 0.2s",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Chip
                        label={notif.type}
                        size="small"
                        sx={{ backgroundColor: tc.bg, color: tc.color, fontWeight: 600, fontSize: "0.7rem" }}
                      />
                      {notif.isRead && (
                        <Chip label="Read" size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                      )}
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {notif.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5, ml: 2 }}>
                    {!notif.isRead && (
                      <IconButton
                        size="small"
                        title="Mark as read"
                        onClick={() => handleMarkRead(notif.id)}
                        sx={{ color: "#2e7d32" }}
                      >
                        <DoneIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      title="Delete"
                      onClick={() => handleDelete(notif.id)}
                      sx={{ color: "#c62828" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Container>
  );
};

export default Home;
