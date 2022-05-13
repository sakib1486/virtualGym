// Dependencies
import PropTypes from "prop-types";
import React from "react";

// Components
import ToolTip from "../../Template/ToolTip";

// Material UI
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

// AverageJointSpeedMetric: A component that displays the average joint speed metric obtained from the session
const AverageJointSpeedMetric = ({ session }) => {
  AverageJointSpeedMetric.propTypes = {
    session: PropTypes.object,
  };

  return (
    <div data-testid="avg-joint-container">
      <div style={{ paddingBottom: "10px" }}>
        <Grid container>
          <Grid item>
            <Typography variant="h5" sx={{ pb: 7 }}>
              Average Joint Speeds
            </Typography>
          </Grid>
          <Grid item>
            <ToolTip description="The average joint speed for left arm, right arm and head that are calculated from the individual joint speeds in centimeters per second" />
          </Grid>
        </Grid>
        <Typography variant="button" fontSize={16}>
          Left Arm
        </Typography>
        <Typography variant="h5" fontSize={28} sx={{ pb: 4 }}>
          {session.leftArmAvgSpeed.toFixed(2)} cm/s
        </Typography>
        <Typography variant="button" fontSize={16}>
          Right Arm
        </Typography>
        <Typography variant="h5" fontSize={28} sx={{ pb: 4 }}>
          {session.rightArmAvgSpeed.toFixed(2)} cm/s
        </Typography>
        <Typography variant="button" fontSize={16}>
          Head
        </Typography>
        <Typography variant="h5" fontSize={28}>
          {session.headAvgSpeed.toFixed(2)} cm/s
        </Typography>
      </div>
    </div>
  );
};

export default AverageJointSpeedMetric;
