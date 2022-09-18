import { useState } from "react";
import Button from "src/Components/Button";
import CheckBox from "src/Components/CheckBox/Index";
import ProductCard from "src/Components/ProductCard";
import { useProducts } from "src/Providers/ProductsProvider";
import { useResponsive } from "src/Providers/ResponsiveProvier";
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

const FilterData = () => {
  const { filterProducts, colorFilter, genderFilter, typeFilter, priceFilter } =
    useProducts();

  const handleFilterClick = (event, selected, filter) => {
    filterProducts(event, selected, filter);
  };

  return (
    <>
      <div className="filters fB d-c">
        <div>Colors</div>
        {colorFilter.map((color, index) => {
          return (
            <CheckBox
              key={index}
              name="color"
              text={color}
              onClick={(event) => handleFilterClick(event, color, "color")}
            />
          );
        })}
        <div>Genders</div>
        {genderFilter.map((gender, index) => {
          return (
            <CheckBox
              key={index}
              name="genders"
              text={gender}
              onClick={(event) => handleFilterClick(event, gender, "gender")}
            />
          );
        })}
        <div>Price</div>
        {priceFilter.map((price, index) => {
          return (
            <CheckBox
              key={index}
              name="price"
              text={price}
              onClick={(event) => handleFilterClick(event, price, "price")}
            />
          );
        })}
        <div>Types</div>
        {typeFilter.map((type, index) => {
          return (
            <CheckBox
              key={index}
              name="types"
              text={type}
              onClick={(event) => handleFilterClick(event, type, "type")}
            />
          );
        })}
      </div>
    </>
  );
};

const Filters = ({ showModal, setShowModal }) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Filters</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <FilterData />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hide-mobile filter-sticky f1">
        <FilterData />
      </div>
    </>
  );
};

const Home = () => {
  const { searchFilters } = useProducts();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="fB a-fs">
        <Filters showModal={showModal} setShowModal={setShowModal} />
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
