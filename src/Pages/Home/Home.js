import { useState } from "react";
import Button from "src/Components/Button";
import Filters from "src/Components/Filters";
import ProductCard from "src/Components/ProductCard";
import { useProducts } from "src/Providers/ProductsProvider";
import { isObjEmpty } from "src/utils/misc";
import "./home.scss";

const ProductsRenderer = () => {
  const { productsMapped, productsLoading } = useProducts();
  if (productsLoading) return "loading.....";

  const products = Object.values(productsMapped);

  if (products.length === 0) return <ProductCard.NoProductsFound />;

  return (
    <section className="productSectionWrapper w100 row row-cols-3">
      {products.map((product, index) => {
        return <ProductCard key={index} {...product} />;
      })}
    </section>
  );
};

const Home = () => {
  const { searchFilters, backup } = useProducts();
  const [showModal, setShowModal] = useState(false);

  const showFilters = isObjEmpty(backup);

  return (
    <>
      <div className="fB a-fs">
        {!showFilters && <Filters showModal={showModal} setShowModal={setShowModal} />}
        <div className="products-container w100 f4 fB d-c a-fe">
          <div className="fB a-s search-wrapper">
            <input
              type="text"
              className="searchInput"
              onChange={searchFilters}
            />
            <Button className="btn-small hide-mobile" type="button">
              <i className="fa fa-search"></i>
            </Button>
            <Button
              className="btn-small hide-desktop"
              type="button"
              onClick={() => setShowModal(true)}
            >
              <i className="fa fa-filter"></i>
            </Button>
          </div>
          <ProductsRenderer />
        </div>
      </div>
    </>
  );
};

export default Home;
