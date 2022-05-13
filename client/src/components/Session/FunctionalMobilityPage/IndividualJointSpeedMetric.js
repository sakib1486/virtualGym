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
  ZoomAndPan,
  CommonSeriesSettings,
  Legend,
  Export,
  ArgumentAxis,
  ScrollBar,
} from "devextreme-react/chart";
import Grid from "@mui/material/Grid";

// IndividualJointSpeedMetric: A component that renders the graph for individual joint speed
const IndividualJointSpeedMetric = ({ session }) => {
  IndividualJointSpeedMetric.propTypes = {
    session: PropTypes.object,
  };

  // Calculate the individual joint speed data to display on the graph
  let timeList = Object.keys(session.leftArmSpeedList);
  let maxValue;
  timeList.sort();
  const distances = Object.keys(session.leftArmSpaceCoverage);
  distances.sort();
  if (timeList.length < 11) {
    maxValue = timeList[timeList.length - 1];
  } else {
    maxValue = timeList[10];
  }

  const visualRange = { startValue: timeList[0], endValue: maxValue };
  let speedDataList = [];

  for (let i = 0; i < timeList.length; i++) {
    speedDataList.push({
      time: timeList[i],
      leftArmSpeed: session.leftArmSpeedList[timeList[i]],
      rightArmSpeed: session.rightArmSpeedList[timeList[i]],
      headSpeed: session.headSpeedList[timeList[i]],
    });
  }

  return (
    <div className="individual-joint-speed-container">
      <Grid className="individual-joint-header" container>
        <Grid item>
          <Typography variant="h5">
            Individual Joint Speeds at each Time Stamp
          </Typography>
        </Grid>
        <Grid item>
          <ToolTip description="The individual joint speed is the amount of rotation calculated at each time stamp for each joint in centimeters per second. The graph shows the joint speeds for left arm, right arm and head where the y-axis is centimeters and the x-axis is a specific point in time in seconds"/>
        </Grid>
      </Grid>

      <Chart id="individualJointSpeedChart" dataSource={speedDataList}>
        <ArgumentAxis defaultVisualRange={visualRange} />
        <ScrollBar visible={true} />
        <ZoomAndPan argumentAxis="both" />
        <CommonSeriesSettings
          argumentField="time"
          type="bar"
          hoverMode="allArgumentPoints"
          selectionMode="allArgumentPoints"
        ></CommonSeriesSettings>
        <Series
          argumentField="time"
          valueField="leftArmSpeed"
          name="left arm"
        />
        <Series valueField="rightArmSpeed" name="right arm" />
        <Series valueField="headSpeed" name="head" />
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        ></Legend>
        <Export enabled={true} />
      </Chart>
    </div>
  );
};

export default IndividualJointSpeedMetric;
