// Dependencies
import React from "react";
import PropTypes from "prop-types";

// files
import { gameTypeRendering } from "../../utils/gameType";
import { formatDate } from "../../utils/dateFormat";

// Material UI
import Typography from "@mui/material/Typography";

// Session: A component that displays the game type, player name, start and end time of a session
// Session is called in Session Item
const Session = ({ session }) => {
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);

  // Renders the text of session
  return (
    <div>
      <Typography variant="h6">
        {gameTypeRendering(session.gameType)}
      </Typography>

      <Typography sx={{ display: "inline" }} component="span" variant="body2">
        <div data-testid="session-player-name">Player: {session.user}</div>
        <div data-testid="session-start-time">
          Start Time: {formatDate(startTime)}
        </div>
        <div data-testid="session-end-time">
          End Time: {formatDate(endTime)}
        </div>
      </Typography>
    </div>
  );
};

// Checks the properties are a valid objecttype
Session.propTypes = {
  session: PropTypes.object,
};

export default Session;
