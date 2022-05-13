// Dependencies
import PropTypes from "prop-types";
import React, { useState } from "react";

// Component Imports
import AverageJointSpeedMetric from "./AverageJointSpeedMetric";
import IndividualJointSpeedMetric from "./IndividualJointSpeedMetric";
import SpaceCoverageMetric from "./SpaceCoverageMetric";

// Material UI
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";

// FunctionalMobility: A component that displays the page for the functional mobility indicators
// Renders the components AverageJointSpeedMetric, IndividualJointSpeedMetric and SpaceCoverageMetric
const FunctionalMobility = ({ session }) => {
  FunctionalMobility.propTypes = {
    session: PropTypes.object,
  };
  // CheckedAvgJoint: Average Joint Speed
  // CheckedIndJoint: Individual Joint Speed
  // CheckedSpaceCoverage: SpaceCoverage
  const [checkedAvgJoint, setCheckedAvgJoint] = useState(true);
  const [checkedIndJoint, setCheckedIndJoint] = useState(true);
  const [checkedSpaceCoverage, setCheckedSpaceCoverage] = useState(true);

  // The themed style for each box containing a metric
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  // Handles whether to show or hide the metric contents
  const handleAvgJointCheck = () => {
    setCheckedAvgJoint((prev) => !prev);
  };
  const handleIndJointCheck = () => {
    setCheckedIndJoint((prev) => !prev);
  };
  const handleSpaceCoverage = () => {
    setCheckedSpaceCoverage((prev) => !prev);
  };

  return (
    <div>
      <Box sx={{ backgroundColor: "#84CDCA", p: 4 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Grid className="joint-speed-container" container spacing={2}>
            {/*Average Joint Speed Metric Box*/}
            <Grid item xs={3} className="average-joint-container">
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedAvgJoint}
                    onChange={handleAvgJointCheck}
                    color="secondary"
                  />
                }
                label="Show Average Joint Speed"
              />
              <div style={{ paddingBottom: "10px" }}>
                <Collapse in={checkedAvgJoint}>
                  <Item sx={{ minHeight: "63vh" }}>
                    <AverageJointSpeedMetric session={session} />
                  </Item>
                </Collapse>
              </div>
            </Grid>

            {/*Individual Joint Speed Metric Box*/}
            <Grid item xs={9} className="individual-joint-container">
              <FormControlLabel
                control={
                  <Switch
                    checked={checkedIndJoint}
                    onChange={handleIndJointCheck}
                    color="secondary"
                  />
                }
                label="Show Individual Joint Speed"
              />
              <div style={{ paddingBottom: "20px" }}>
                <Collapse in={checkedIndJoint}>
                  <Item sx={{ minHeight: "60vh" }}>
                    <IndividualJointSpeedMetric session={session} />
                  </Item>
                </Collapse>
              </div>
            </Grid>
          </Grid>

          {/*Space Coverage Metric Box*/}
          <FormControlLabel
            control={
              <Switch
                checked={checkedSpaceCoverage}
                onChange={handleSpaceCoverage}
                color="secondary"
              />
            }
            label="Show Space Coverage"
          />
          <div style={{ paddingBottom: "10px" }}>
            <Collapse in={checkedSpaceCoverage}>
              <Item>
                <SpaceCoverageMetric session={session} />
              </Item>
            </Collapse>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default FunctionalMobility;
