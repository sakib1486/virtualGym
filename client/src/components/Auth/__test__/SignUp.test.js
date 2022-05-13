import React from "react";
import { render } from "@testing-library/react";

import SignUp from "../SignUp";

// Test Suite for Google Sign Up
describe("Google Sign Up", () => {
  // Test if the signup title is on the page
  it("has sign up title on the page", async () => {
    const { getByText } = render(<SignUp />);
    const title = getByText("Sign Up");
    expect(title).toBeInTheDocument;
  });

  // Test if the Google signup button is on the page
  it("has google sign up button on the page", async () => {
    const { getByText } = render(<SignUp />);
    const googleSignUpButton = getByText("Sign Up With Google");
    expect(googleSignUpButton).toBeInTheDocument;
  });
});

// Test Suite for Standard Sign Up
describe("Standard Sign Up", () => {
  // Test if the signup button is on the page
  it("has standard sign up button on the page", async () => {
    const { getByText } = render(<SignUp />);
    const emailInput = getByText("Sign Up");
    expect(emailInput).toBeInTheDocument;
  });

  it("has email input button on the page", async () => {
    const { getAllByText } = render(<SignUp />);
    const emailInput = getAllByText("Email *");
    expect(emailInput).toBeInTheDocument;
  });

  it("has password input on the page", async () => {
    const { getAllByText } = render(<SignUp />);
    const passwordInput = getAllByText("Password *");
    expect(passwordInput).toBeInTheDocument;
  });
  it("has first name input on the page", async () => {
    const { getAllByText } = render(<SignUp />);
    const emailInput = getAllByText("First Name *");
    expect(emailInput).toBeInTheDocument;
  });
  it("has last name input on the page", async () => {
    const { getAllByText } = render(<SignUp />);
    const emailInput = getAllByText("Last Name *");
    expect(emailInput).toBeInTheDocument;
  });
  it("has confirm password name input on the page", async () => {
    const { getAllByText } = render(<SignUp />);
    const emailInput = getAllByText("Confirm Password *");
    expect(emailInput).toBeInTheDocument;
  });
});
