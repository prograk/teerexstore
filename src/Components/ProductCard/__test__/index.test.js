import { render, screen } from "@testing-library/react";
import ProductCard from "..";

const MockProductCard = () => (
  <ProductCard
    {...{
      id: 2,
      imageURL:
        "https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/polo-tshirts.png",
      name: "Blue Polo",
      type: "Polo",
      price: 350,
      currency: "INR",
      color: "Blue",
      gender: "Women",
      quantity: 3,
    }}
  />
)

describe("Product card", () => {
  test("product card loaded", () => {
    render(<MockProductCard />);
    const productCardElem = screen.getByTestId("product-card-2");
    expect(productCardElem).toBeInTheDocument();
  });
});
