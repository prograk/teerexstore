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
              <NavLink to="/" exact="true">TeeRex Store</NavLink>
            </h1>
            <nav className="fB a-c">
              <NavLink
                to="/"
                exact="true"
                style={({ isActive }) => {
                    return isActive ? { textDecoration: "underline" } : undefined
                  }
                }
              >
                Products
              </NavLink>
              <div>
                <NavLink to="/bag" exact="true" className="cartBag">
                  <i
                    className="fa fa-shopping-cart header_icon"
                    aria-hidden="true"
                  ></i>{" "}
                  {cartCount > 0 && <sup>{cartCount}</sup>}
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
