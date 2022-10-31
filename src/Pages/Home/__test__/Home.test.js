import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { getProducts } from "src/api";
import Header from "src/Components/Header";
import Home from "../Home";

const MockComponent = () => (
  <BrowserRouter>
    <Header />
    <Home />
  </BrowserRouter>
);

describe("Home", () => {
  test("check if home page is loaded", () => {
    render(<MockComponent />);
    const homeLink = screen.getByTitle("homepage");
    expect(homeLink).toHaveClass("active");
  });

  test("check if sorf filter rendered", () => {
    render(<MockComponent />);
    const textElement = screen.getByText(/Sort By:/i);
    expect(textElement).toBeInTheDocument();
  });

  test("search filter should change", () => {
    render(<MockComponent />);
    const searchEl = screen.getByTestId("searchinput");
    const testSearch = "Black Polo";
    fireEvent.change(searchEl, { target: { value: testSearch } });
    expect(searchEl.value).toBe(testSearch);
  });

  test("check if api is working", async () => {
    const products = await getProducts();
    expect(products.length).toBeGreaterThan(1);
  });
});

  
