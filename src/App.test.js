import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("render App test if it's rendered", () => {
    render(<App />);
    const linkText = screen.getByText(/Products/i);
    expect(linkText).toBeVisible();
  });
  
  test("render sort filter options", () => {
    render(<App />);
    const sortElem = screen.getByTestId('sortdropdown');
    const options = Array.from(sortElem.options);
    expect(options[0].selected).toBe(true);
  })
})