// Dependencies
import PropTypes from "prop-types";
import React from "react";

// Components
import ToolTip from "../../Template/ToolTip";

// Material UI
import { Typography } from "@mui/material";
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Label,
  Format,
  Legend,
  Export,
} from "devextreme-react/chart";
import Grid from "@mui/material/Grid";

// SpaceCoverageMetric: A component that renders the graph for space
const SpaceCoverageMetric = ({ session }) => {
  SpaceCoverageMetric.propTypes = {
    session: PropTypes.object,
  };

  // Calculate space coverage data to display on the graph
  const distances = Object.keys(session.leftArmSpaceCoverage);
  distances.sort();
  let spaceCoverageDataList = [];
  for (let i = 0; i < distances.length; i++) {
    spaceCoverageDataList.push({
      distance: distances[i],
      leftArmDistance: session.leftArmSpaceCoverage[distances[i]],
      rightArmDistance: session.rightArmSpaceCoverage[distances[i]],
    });
  }

  return (
    <div>
      {/*Space Coverage Metric Box*/}
      <Grid className="space-coverage-header" container>
        <Grid item>
          <Typography variant="h5">Space Coverage for Each Arm</Typography>
        </Grid>
        <Grid item>
          <ToolTip description="Space Coverage describes the number of times a joint was a certain distance away from the head. The graph shows the space coverage for the left arm and right arm where the x-axis is the distance in centimeters and the y-axis is the number of times the joints were at that distance"/>
        </Grid>
      </Grid>

      <Chart id="spaceCoverageChart" dataSource={spaceCoverageDataList}>
        <CommonSeriesSettings
          argumentField="distance"
          type="bar"
          hoverMode="allArgumentPoints"
          selectionMode="allArgumentPoints"
        >
          <Label visible={true}>
            <Format type="fixedPoint" precision={0} />
          </Label>
        </CommonSeriesSettings>
        <Series
          argumentField="distance"
          valueField="leftArmDistance"
          name="left arm"
        />
        <Series valueField="rightArmDistance" name="right arm" />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        ></Legend>
        <Export enabled={true} />
      </Chart>
    </div>
  );
};

export default SpaceCoverageMetric;
