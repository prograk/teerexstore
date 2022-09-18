import { useProducts } from "src/Providers/ProductsProvider";
import { formatCurrency } from "src/utils/misc";
import Dropdown from "../Dropdown";
import "./bagProductCards.scss";

const NoProductsFound = () => {
  return (
    <div className="card no-product-card">
      No Products added to Bag
    </div>
  );
};

const BagProductCards = ({
  id,
  name,
  price,
  currency,
  imageURL,
  quantity,
  addedQty,
}) => {
  const { addToBag } = useProducts();

  return (
    <div className="col">
      <div className="card">
        <div className="product-bag-card fB w100 j-sb a-c">
          <div>
            <img src={imageURL} alt={name} />
          </div>
          <div>
            <h5>{name}</h5>
            <span>{formatCurrency(price, currency)}</span>
          </div>
          <div className="qty-drpdown">
            <Dropdown
              onChange={(event) => addToBag(event, { id, dropDown: true })}
              value={addedQty}
            >
              {Array(quantity)
                .fill(null)
                .map((e, i) => i + 1)
                .map((q) => (
                  <option key={q} selected={addedQty === q}>{q}</option>
                ))}
            </Dropdown>
          </div>
          <div>
            <button
              type="button"
              onClick={(event) => addToBag(event, { id, qty: -2 })}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BagProductCards.NoProductsFound = NoProductsFound;

export default BagProductCards;
