import React from "react";
import { render } from "@testing-library/react";
import Session from "./../Session";
import "@testing-library/jest-dom/extend-expect";

// A component test that renders a single session's overview details
// US 3.0.1 - Progress Dashboard
// Session is part of progress dashboard that shows game name, player name, start time and end time
describe("Session", () => {
  let props;

  beforeAll(() => {
    props = {
      userFirstName: "John",
      userLastName: "Doe",
      startTime: "2022-02-22T23:02:11Z",
      endTime: "2022-02-22T23:05:14Z",
      gameType: "climbing",
      user: "JohnDoe",
    };
  });

  it("renders game name correctly", async () => {
    const { getByText } = render(<Session session={props} />);
    expect(getByText("Climbing")).toBeInTheDocument;
  });

  it("renders player name correctly", async () => {
    const { getByTestId } = render(<Session session={props} />);
    expect(getByTestId("session-player-name")).toHaveTextContent("JohnDoe");
  });

  it("renders start time correctly", async () => {
    const { getByTestId } = render(<Session session={props} />);
    expect(getByTestId("session-start-time")).toHaveTextContent(
      "Start Time: Feb 22, 2022 at 4:02:11 PM"
    );
  });

  it("renders end time correctly", async () => {
    const { getByTestId } = render(<Session session={props} />);
    expect(getByTestId("session-end-time")).toHaveTextContent(
      "End Time: Feb 22, 2022 at 4:05:14 PM"
    );
  });
});
