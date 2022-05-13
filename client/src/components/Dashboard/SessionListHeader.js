// Dependencies
import React from "react";
import "@fontsource/roboto";
import "./SessionListHeader.css";

// Material UI
import { Typography } from "@mui/material";

// SessionListHeader: a component that renders the Session text
const SessionListHeader = () => {
  return (
    <div className="session-list-header">
      <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
        Sessions List
      </Typography>
    </div>
  );
};

export default SessionListHeader;
