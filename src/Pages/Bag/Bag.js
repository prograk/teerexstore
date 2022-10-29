import BagProductCards from "src/Components/BagProductCards";
import { useProducts } from "src/Providers/ProductsProvider";
import "./bag.scss";

const Bag = () => {
  const { productsMapped, products } = useProducts();

  // const BagProducts = Object.values(productsMapped).filter(
  //   (data) => data.addedQty
  // );

  const BagProducts = products.filter(
    (data) => data.addedQty
  );

  if (BagProducts.length === 0) return <BagProductCards.NoProductsFound />;

  return <div className="row row-cols-1 bagproductsWrapper">
    {BagProducts.map((product) => {
      return (
        <BagProductCards key={product.id} {...product} />
      );
    })}
  </div>;
};

export default Bag;
