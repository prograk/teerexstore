import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "..";

const MockComponent = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
)

describe("Header", () => {
  test("is Header rendered", () => {
    render(<MockComponent />);
    const linkText = screen.getByRole("heading", { name: "TeeRex Store" });
    expect(linkText).toBeInTheDocument();
  });
})
