import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SessionDetails from "./../SessionDetails";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/session",
    state: {
      userFirstName: "John",
      userLastName: "Doe",
      startTime: "2022-02-22T23:02:11Z",
      endTime: "2022-02-22T23:02:14Z",
      gameType: "climbing",
      hits: 12,
      misses: 15,
      avgHitSpeed: 18.0,
    },
  }),
}));

jest.mock("../GamePerformancePage/GamePerformance.js", () => {
  const GamePerformance = () => <div />;
  return GamePerformance;
});

jest.mock("../FunctionalMobilityPage/FunctionalMobility.js", () => {
  const FunctionalMobility = () => <div />;
  return FunctionalMobility;
});

jest.mock("../CompareProgressPage/CompareProgress.js", () => {
  const CompareProgress = () => <div />;
  return CompareProgress;
});

// A component test that renders the Session Details page that contains Game Performance Statistics
// US 4.0.1 - Game Performance - Game Performance statistics should show correct: Hits, Misses, Average Target Time
describe("Session Details Page", () => {
  // US 3.0.1 - Progress Dashboard - contains links that navigate to game performance and functional mobility indicators
  it("Selecting a tab changes the page", async () => {
    // Session Details pagestart at the game performance tab
    const page = render(<SessionDetails />);
    const gamePerfTab = page.getByText("GAME PERFORMANCE").closest("button");
    const funcMobTab = page.getByText("FUNCTIONAL MOBILITY").closest("button");
    const compProgress = page.getByText("COMPARE PROGRESS").closest("button");
    expect(gamePerfTab).toHaveAttribute("aria-selected", "true");
    expect(funcMobTab).toHaveAttribute("aria-selected", "false");
    expect(compProgress).toHaveAttribute("aria-selected", "false");

    // Select the Functional Mobility tab
    fireEvent.click(funcMobTab);
    expect(gamePerfTab).toHaveAttribute("aria-selected", "false");
    expect(funcMobTab).toHaveAttribute("aria-selected", "true");
    expect(compProgress).toHaveAttribute("aria-selected", "false");

    // Select the Compare Progress tab
    fireEvent.click(compProgress);
    expect(gamePerfTab).toHaveAttribute("aria-selected", "false");
    expect(funcMobTab).toHaveAttribute("aria-selected", "false");
    expect(compProgress).toHaveAttribute("aria-selected", "true");
  });
});
