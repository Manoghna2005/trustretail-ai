import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

test("renders default shop owner dashboard", () => {
  render(<App />);
  expect(screen.getByText("Inventory Management")).toBeInTheDocument();
});

test("switches to customer view from sidebar", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Customer" }));
  expect(screen.getByText("Nearby Shops")).toBeInTheDocument();
});

test("switches to complaints hub and shows complaint search", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Complaints Hub" }));
  expect(screen.getByPlaceholderText("Search complaints...")).toBeInTheDocument();
});
