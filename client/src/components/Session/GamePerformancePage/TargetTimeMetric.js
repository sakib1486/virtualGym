// Dependencies
import React from "react";
import PropTypes from "prop-types";

// Components
import ToolTip from "../../Template/ToolTip";

// Material UI
import { Grid, Typography } from "@mui/material";
import {
  Chart,
  BarSeries,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";

// TargetTimeMetric: A component that displays the target time metrics.
const TargetTimeMetric = ({ targetListData, targetTime }) => {
  TargetTimeMetric.propTypes = {
    targetTime: PropTypes.number,
    targetListData: PropTypes.array,
  };

  // Data to be passed to target hit time chart
  const data = targetListData;

  // Renders TargetTime metric
  return (
    <div
      className="target-time-metric-container"
      data-testid="target-time-container"
    >
      <div className="target-time-header">
        <Grid container>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Target Time
            </Typography>
          </Grid>
          <Grid item>
            <ToolTip description="The period of time starting from when a target appears up to when a target is hit. For each target, the graph records the time it took for each one to be hit in seconds" />
          </Grid>
        </Grid>
        <Grid container sx={{ pb: 3 }}>
          {targetTime > 0 ? (
            <div>Average Target Time: {targetTime.toFixed(2)} seconds</div>
          ) : (
            <div>Average Target Time: N/A</div>
          )}
        </Grid>
      </div>
      {data.length > 0 && (
        <Chart data={data} height={280}>
          <ValueAxis />
          <BarSeries valueField="timeUntilHit" argumentField="target" />
          <Animation />
        </Chart>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="p" gutterBottom align="center">
          All Targets
        </Typography>
      </div>
    </div>
  );
};

export default TargetTimeMetric;
