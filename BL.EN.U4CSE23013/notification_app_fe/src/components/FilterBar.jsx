import React from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import EventIcon from "@mui/icons-material/Event";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";

const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { value: "", label: "All", icon: <AllInboxIcon fontSize="small" /> },
    { value: "Event", label: "Events", icon: <EventIcon fontSize="small" /> },
    { value: "Result", label: "Results", icon: <EmojiEventsIcon fontSize="small" /> },
    { value: "Placement", label: "Placements", icon: <WorkIcon fontSize="small" /> },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        Filter by:
      </Typography>
      <ToggleButtonGroup
        value={activeFilter}
        exclusive
        onChange={(e, val) => {
          if (val !== null) onFilterChange(val);
        }}
        size="small"
      >
        {filters.map((f) => (
          <ToggleButton
            key={f.value}
            value={f.value}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              gap: 0.5,
              px: 2,
              "&.Mui-selected": {
                backgroundColor: "#1a1a2e",
                color: "white",
                "&:hover": { backgroundColor: "#2a2a4e" },
              },
            }}
          >
            {f.icon}
            {f.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default FilterBar;
