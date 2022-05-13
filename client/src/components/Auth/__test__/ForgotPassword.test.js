import React from "react";
import { render } from "@testing-library/react";

import ForgotPassword from "../ForgotPassword";

describe("Forgot Password", () => {
  // Test if the forgot password title is on the screen
  it("has title on the page", async () => {
    const { getByText } = render(<ForgotPassword />);
    const title = getByText("Forgot Password");
    expect(title).toBeInTheDocument;
  });

  // Test if the email input field is one the screen
  it("has input field on the page", async () => {
    const { getByText } = render(<ForgotPassword />);
    const inputField = getByText("Email");
    expect(inputField).toBeInTheDocument;
  });

  // Test if the request button is on the screen
  it("has input field on the page", async () => {
    const { getByText } = render(<ForgotPassword />);
    const requestButton = getByText("Request password reset");
    expect(requestButton).toBeInTheDocument;
  });
});
