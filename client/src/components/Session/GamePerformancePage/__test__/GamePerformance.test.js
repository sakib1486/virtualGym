import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import PerformanceTable from "./../PerformanceTable";
import HitMissMetric from "./../HitMissMetric";
import TargetTimeMetric from "../TargetTimeMetric";

// A component test for PerformanceTable component that checks if the information is rendered correctly
describe("Performance Table", () => {
  let sessionProps = {
    userFirstName: "John",
    userLastName: "Doe",
    startTime: "2022-02-22T23:02:11Z",
    endTime: "2022-02-22T23:05:14Z",
    gameType: "bubbles",
    version: "3.0",
    user: "JohnDoe",
  };
  it("renders performance table information correctly", async () => {
    const { getByText } = render(<PerformanceTable session={sessionProps} />);
    expect(getByText("Bubbles")).toBeInTheDocument();
    expect(getByText("3.0")).toBeInTheDocument();
    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("JohnDoe")).toBeInTheDocument();
    expect(getByText("00:03:03")).toBeInTheDocument();
  });
});

// A component test for HitsMissMetric
// US 4.0.2 - View Hits and Misses - shows the number of hits and misses as numbers
describe("Hit Miss Metric", () => {
  let hitProps = 10;
  let missProps = 11;

  it("renders hits and misses correctly", async () => {
    const { getByTestId } = render(
      <HitMissMetric hits={hitProps} misses={missProps} />
    );
    expect(getByTestId("hits-miss-container")).toHaveTextContent(
      "Hits and Misses"
    );
    expect(getByTestId("hits-miss-container")).toHaveTextContent(
      "Number of Hits: 10"
    );
    expect(getByTestId("hits-miss-container")).toHaveTextContent(
      "Number of Misses: 11"
    );
  });
});

// A component test for TargetTimeMetric
// US 4.0.3 - Average target time - shows the average target time in seconds

// Mock ValueAxis component
jest.mock("@devexpress/dx-react-chart-material-ui", () => {
  const lib = jest.requireActual("@devexpress/dx-react-chart-material-ui");
  return {
    ...lib,
    ValueAxis: () => <div />,
  };
});

describe("Target Time Metric", () => {
  let targetTimeProps = 15;
  let targetListDataProps = [
    {
      target: "TargetRight0",
      timeUntilHit: 3.888,
    },
    {
      target: "TargetLeft0",
      timeUntilHit: 6.896000000000001,
    },
  ];

  it("renders target time correctly", async () => {
    const { getByTestId } = render(
      <TargetTimeMetric
        targetListData={targetListDataProps}
        targetTime={targetTimeProps}
      />
    );
    expect(getByTestId("target-time-container")).toHaveTextContent(
      "Target Time"
    );
    expect(getByTestId("target-time-container")).toHaveTextContent(
      "Average Target Time: 15.00 seconds"
    );
  });
});
