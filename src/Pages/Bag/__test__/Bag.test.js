import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "src/Components/Header";
import Bag from "../Bag";

const MockComponent = () => (
  <BrowserRouter>
    <Header />
    <Bag />
  </BrowserRouter>
);

describe("Bag", () => {
  test("check if bag page active", () => {
    render(<MockComponent />);
    const bagLink = screen.getByTitle("bagpage");
    fireEvent.click(bagLink);
    expect(bagLink).toHaveClass("active");
  });
});

  
