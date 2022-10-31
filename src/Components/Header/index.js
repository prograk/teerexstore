import { NavLink } from "react-router-dom";
import { useProducts } from "src/Providers/ProductsProvider";
import "./header.scss";

const Header = () => {
  const { cartCount } = useProducts();
  return (
    <>
      <div className="store-header fB a-c">
        <div className="container-fluid">
          <div className="fB w100 j-sb">
            <h1 className="logo">
              <NavLink to="/">
                TeeRex Store
              </NavLink>
            </h1>
            <nav className="fB a-c">
              <NavLink
                to="/home"
                className="home"
                title="homepage"
              >
                Products
              </NavLink>
              <div>
                <NavLink
                  to="/bag"
                  className="bag"
                  title="bagpage"
                >
                  <i
                    className="fa fa-shopping-cart header_icon"
                    aria-hidden="true"
                  ></i>{" "}
                  {cartCount > 0 && (
                    <sup data-testid="cartvalue">{cartCount}</sup>
                  )}
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
