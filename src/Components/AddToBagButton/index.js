import { useProducts } from "src/Providers/ProductsProvider";
import Button from "../Button";
import "./addToBagButton.scss";

const OutOfStockButton = () => <Button className="btn-text btn-warning">Out of Stock</Button>;

const WithAddToBagButton = (props) => {
  const { addToBag } = useProducts();
  const { id } = props;
  return (
    <Button type="button" className="btn-addbag fB" onClick={() => addToBag({ id })}>
      Add To Bag
    </Button>
  )
};

const WithPlusMinusButton = (props) => {
  const { addedQty, id } = props;
  const { addToBag } = useProducts();
  return (
    <Button type="button" className="btn-qty fB">
      <div onClick={() => addToBag({ id, qty: -1 })} className="f1">-</div>
      { addedQty }
      <div onClick={() => addToBag({ id })} className="f1">+</div>
    </Button>
  )
};

const AddToBagButton = (props) => {
  const { addedQty, quantity } = props;
  
  if (quantity === 0) return <OutOfStockButton />;

  return addedQty > 0 ? (
    <WithPlusMinusButton {...props} />
    ) : (
    <WithAddToBagButton {...props} />
  );
};

export default AddToBagButton;