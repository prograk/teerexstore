import { useProducts } from "src/Providers/ProductsProvider";
import { useResponsive } from "src/Providers/ResponsiveProvier";
import { isObjEmpty } from "src/utils/misc";
import CheckBox from "../CheckBox/Index";

const FitlerDataItem = ({ name, filter }) => {
  const { filterProducts } = useProducts();

  const handleFilterClick = (event, selected, filter) => {
    filterProducts(event, selected, filter);
  };

  if (filter.length === 0) return null;

  return (
    <>
      <div className="capitalize">{name}</div>
      {filter.map((data, index) => {
        return (
          <CheckBox
            key={index}
            name={name}
            text={data}
            onClick={(event) => handleFilterClick(event, data, name)}
          />
        );
      })}
    </>
  );
};

const FilterData = () => {
  const { colorFilter, genderFilter, typeFilter, priceFilter, backup } = useProducts();

  if (isObjEmpty(backup)) return null;

  return (
    <>
      <div className="filters fB d-c">
        <FitlerDataItem
          {...{
            name: "color",
            filter: colorFilter,
          }}
        />
        <FitlerDataItem
          {...{
            name: "gender",
            filter: genderFilter,
          }}
        />
        <FitlerDataItem
          {...{
            name: "price",
            filter: priceFilter,
          }}
        />
        <FitlerDataItem
          {...{
            name: "type",
            filter: typeFilter,
          }}
        />
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

export default Filters;
