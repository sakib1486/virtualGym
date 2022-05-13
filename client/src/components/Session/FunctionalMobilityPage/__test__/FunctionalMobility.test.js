import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AverageJointSpeedMetric from "../AverageJointSpeedMetric";

// A component test that tests average joint speed
describe("Average Joint Speed", () => {
  let sessionProps = {
    userFirstName: "John",
    userLastName: "Doe",
    startTime: "2022-02-22T23:02:11Z",
    endTime: "2022-02-22T23:05:14Z",
    gameType: "bubbles",
    version: "3.0",
    user: "JohnDoe",
    leftArmAvgSpeed: 27.67614004536727,
    rightArmAvgSpeed: 27.352744849654474,
    headAvgSpeed: 16.08445834110707,
  };
  it("renders average joint speed correctly", async () => {
    const { getByText } = render(
      <AverageJointSpeedMetric session={sessionProps} />
    );
    // Left Arm
    expect(getByText("27.68 cm/s")).toBeInTheDocument();
    // Right Arm
    expect(getByText("27.35 cm/s")).toBeInTheDocument();
    // head
    expect(getByText("16.08 cm/s")).toBeInTheDocument();
  });

  it("renders header correctly", async () => {
    const { getByTestId } = render(
      <AverageJointSpeedMetric session={sessionProps} />
    );
    expect(getByTestId("avg-joint-container")).toHaveTextContent(
      "Average Joint Speeds"
    );
  });
});
