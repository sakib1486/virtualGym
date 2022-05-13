// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";

// Component Imports
import HitMissMetric from "./HitMissMetric";
import TargetTimeMetric from "./TargetTimeMetric";
import PerformanceTable from "./PerformanceTable";

// Material UI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";

// GamePerformance: A component that displays the page for game performance
// Renders the PerformanceTableMetric, HitMissMetric and TargetTimeMetric components
const GamePerformance = ({ session }) => {
  // CheckedTable: Performance Table
  // CheckedHitAndMiss: Hits and Misses
  // CheckedTargetTime: Target Time
  const [checkedTable, setCheckedTable] = useState(true);
  const [checkedHitAndMiss, setCheckedHitAndMiss] = useState(true);
  const [checkedTargetTime, setCheckedTargetTime] = useState(true);

  // Handles whether to show or hide the metric contents
  const handleTableCheck = () => {
    setCheckedTable((prev) => !prev);
  };
  const handleHitsAndMissesCheck = () => {
    setCheckedHitAndMiss((prev) => !prev);
  };
  const handleTimeCheck = () => {
    setCheckedTargetTime((prev) => !prev);
  };

  // The themed style for the metric boxes
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: "left",
    color: theme.palette.text.secondary,
    minHeight: "60vh",
  }));

  // Renders the game statistics that show player name, game name, start and end time
  // Also renders the HitMissMetric component and TargetTimeMetric component
  return (
    <div className="game-performance-container">
      <div className="metrics-container">
        <Box sx={{ backgroundColor: "#84CDCA", p: 4 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* Performance Table Box*/}
            <div style={{ width: "30vw", margin: "10px" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedTable}
                    onChange={handleTableCheck}
                    color="secondary"
                  />
                }
                label="Show Performance Table"
              />
              <Collapse in={checkedTable}>
                <Item>
                  <PerformanceTable session={session} />
                </Item>
              </Collapse>
            </div>

            {/* Hit and Miss Metric Box */}
            <div style={{ width: "30vw", margin: "10px" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedHitAndMiss}
                    onChange={handleHitsAndMissesCheck}
                    color="secondary"
                  />
                }
                label="Show Hits and Misses"
              />
              <Collapse in={checkedHitAndMiss}>
                <Grid item>
                  <Item>
                    <HitMissMetric
                      hits={session.hits}
                      misses={session.misses}
                    />
                  </Item>
                </Grid>
              </Collapse>
            </div>

            {/* Target Time Metric Box*/}
            <div style={{ width: "30vw", margin: "10px" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedTargetTime}
                    onChange={handleTimeCheck}
                    color="secondary"
                  />
                }
                label="Show Target Time"
              />
              <Collapse in={checkedTargetTime}>
                <Grid item>
                  <Item>
                    <TargetTimeMetric
                      targetListData={session.targetHitSpeedList}
                      targetTime={session.avgHitSpeed}
                    />
                  </Item>
                </Grid>
              </Collapse>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

GamePerformance.propTypes = {
  session: PropTypes.object,
};

export default GamePerformance;
