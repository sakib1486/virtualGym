import React from "react";
import { render } from "@testing-library/react";

import Login from "../Login";

describe("Google login", () => {
  // Test if the login title is on the page
  it("has login title on the page", async () => {
    const { getByText } = render(<Login />);
    const title = getByText("Log In");
    expect(title).toBeInTheDocument;
  });

  // Test if the Google login button is on the page
  it("has google login button on the page", async () => {
    const { getByText } = render(<Login />);
    const googleLoginButton = getByText("Log In With Google");
    expect(googleLoginButton).toBeInTheDocument;
  });
});

describe("Standard login", () => {
  // Test if the login title is on the page

  // Test if the Google login button is on the page
  it("has standard login button on the page", async () => {
    const { getByText } = render(<Login />);
    const loginButton = getByText("Log In");
    expect(loginButton).toBeInTheDocument;
  });

  // Test if email input is one the page
  it("has email input field", async () => {
    const { getByText } = render(<Login />);
    const emailInput = getByText("Email");
    expect(emailInput).toBeInTheDocument;
  });

  // Test if password input is one the page
  it("has password input field", async () => {
    const { getByText } = render(<Login />);
    const passwordInput = getByText("Password");
    expect(passwordInput).toBeInTheDocument;
  });
});
