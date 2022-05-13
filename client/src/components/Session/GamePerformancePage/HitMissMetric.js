// Dependencies
import React from "react";
import PropTypes from "prop-types";

// Components
import ToolTip from "../../Template/ToolTip";

// Material UI
import {
  Chart,
  PieSeries,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

// HitMissMetric: A component that displays the hit and miss metrics as numbers
// The hit miss data is passed as properties from GamePerformance
const HitMissMetric = ({ hits, misses }) => {
  HitMissMetric.propTypes = {
    hits: PropTypes.number,
    misses: PropTypes.number,
  };

  // Retrieves the data from the props and sets it as the chart data
  const chartData = [
    { metric: "Hit", number: hits },
    { metric: "Miss", number: misses },
  ];

  // Renders the chart using the chart data and the text for number of hits and misses
  return (
    <div
      className="hit-miss-metric-container"
      data-testid="hits-miss-container"
    >
      <div className="hit-miss-header">
        <Grid container sx={{ pb: 3 }}>
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Hits and Misses
            </Typography>
            <div>Number of Hits: {hits} </div>
            <div>Number of Misses: {misses}</div>
          </Grid>
          <Grid item>
            <ToolTip description="Describes the number of targets that were successfully hit and the number of targets that were missed during the current game session" />
          </Grid>
        </Grid>
      </div>
      <div className="pie-chart">
        <Chart data={chartData} height={230}>
          <PieSeries
            valueField="number"
            argumentField="metric"
            outerRadius={1}
          />
          <Animation />
          <Legend />
        </Chart>
      </div>
    </div>
  );
};

export default HitMissMetric;
