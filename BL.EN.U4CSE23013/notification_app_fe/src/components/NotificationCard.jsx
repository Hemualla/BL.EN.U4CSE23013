import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";
import CircleIcon from "@mui/icons-material/Circle";

const NotificationCard = ({ notification, isRead, onToggleRead }) => {
  const { ID, Type, Message, Timestamp } = notification;

  const typeConfig = {
    Event: {
      color: "#2196f3",
      bgColor: "#e3f2fd",
      icon: <EventIcon />,
    },
    Result: {
      color: "#4caf50",
      bgColor: "#e8f5e9",
      icon: <EmojiEventsIcon />,
    },
    Placement: {
      color: "#ff9800",
      bgColor: "#fff3e0",
      icon: <WorkIcon />,
    },
  };

  const config = typeConfig[Type] || typeConfig.Event;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      elevation={isRead ? 1 : 3}
      sx={{
        borderLeft: `4px solid ${config.color}`,
        opacity: isRead ? 0.7 : 1,
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Chip
            icon={config.icon}
            label={Type}
            size="small"
            sx={{
              backgroundColor: config.bgColor,
              color: config.color,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isRead && (
              <CircleIcon
                sx={{ fontSize: 10, color: config.color }}
                titleAccess="Unread"
              />
            )}
            <IconButton
              size="small"
              onClick={() => onToggleRead(ID)}
              sx={{ color: config.color }}
            >
              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                {isRead ? "Mark Unread" : "Mark Read"}
              </Typography>
            </IconButton>
          </Box>
        </Box>

        {/* Message */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: "#333",
            mb: 1,
            lineHeight: 1.5,
          }}
        >
          {Message}
        </Typography>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{ color: "#999", fontSize: "0.75rem" }}
        >
          {formatDate(Timestamp)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
