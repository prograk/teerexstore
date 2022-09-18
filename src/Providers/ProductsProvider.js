import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getProducts } from "src/api";
import { isObjEmpty } from "src/utils/misc";
import useLoadingApi from "src/utils/useLoadingApi";
import { useSnackbar } from "react-simple-snackbar";

const ProductsContext = createContext({});

const ProductsProvider = ({ children }) => {
  const [productsMapped, setProductsMapped] = useState({});
  const [backup, setBackup] = useState({});
  const [colorFilter, setColorFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [filtersSelected, setFiltersSelected] = useState([]);
  const [openSnackbar] = useSnackbar();

  const getFilters = (products) => {
    const colors = new Set();
    const genders = new Set();
    const prices = new Set();
    const types = new Set();
    Object.values(products).forEach((product) => {
      colors.add(product.color);
      genders.add(product.gender);
      prices.add(product.price);
      types.add(product.type);
    });
    setColorFilter([...Array.from(colors).sort((a, b) => a - b)]);
    setGenderFilter([...Array.from(genders).sort((a, b) => a - b)]);
    setPriceFilter([...Array.from(prices).sort((a, b) => a - b)]);
    setTypeFilter([...Array.from(types).sort((a, b) => a - b)]);
  };
  
  const productHashFn = (products) => {
    return products.reduce((acc, product) => {
      const addedQty = product?.addedQty > 0 ? product.addedQty : 0;
      acc[product.id] = {
        ...product,
        addedQty,
      };
      return acc;
    }, {});
  }

  const getProductsCallback = useCallback(async () => {
    await getProducts().then((res) => {
      const productsHash = productHashFn(res);
      getFilters(productsHash);
      setProductsMapped(productsHash);
      setBackup(productsHash);
    });
  }, [setProductsMapped]);

  const {
    call: fetchProducts,
    loading: productsLoading,
    loaded: productsLoaded,
  } = useLoadingApi(getProductsCallback);

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToBag = useCallback(
    (event = null, { id, qty = 1, dropDown = false }) => {
      let product = { ...productsMapped[id] };
      if (!product) return;
      if (!dropDown) {
        if (!!product) {
          let { addedQty = 0 } = product;
          if (qty === -2) {
            let count = cartCount;
            const tempData = {
              ...productsMapped,
              [product.id]: {
                ...product,
                addedQty: 0,
              },
            };
            const bkTempData = {
              ...backup,
              [product.id]: {
                ...product,
                addedQty: addedQty + 1,
              },
            };
            setProductsMapped({
              ...tempData,
            });
            setBackup({
              ...bkTempData,
            });
            count = cartCount - addedQty;
            setCartCount(count);
            return;
          }
          if (qty > 0) {
            const { quantity: productQty } = product;
            if (addedQty < productQty) {
              const tempData = {
                ...productsMapped,
                [product.id]: {
                  ...product,
                  addedQty: addedQty + 1,
                },
              };
              const bkTempData = {
                ...backup,
                [product.id]: {
                  ...product,
                  addedQty: addedQty + 1,
                },
              };
              setProductsMapped({
                ...tempData,
              });
              setBackup({
                ...bkTempData,
              });
              setCartCount((prev) => prev + 1);
            } else {
              openSnackbar("Product quantity exceeded");
            }
          } else {
            if (addedQty > 0) {
              const tempData = {
                ...productsMapped,
                [product.id]: {
                  ...product,
                  addedQty: addedQty - 1,
                },
              };
              const bkTempData = {
                ...backup,
                [product.id]: {
                  ...product,
                  addedQty: addedQty - 1,
                },
              }
              setProductsMapped({
                ...tempData,
              });
              setBackup({
                ...bkTempData,
              });
              setCartCount((prev) => prev - 1);
            }
          }
        }
      } else {
        const quantity = Number(event.target.value);
        let count = 0;
        const tempData = {
          ...productsMapped,
          [product.id]: {
            ...product,
            addedQty: quantity,
          },
        };
        const bkTempData = {
          ...backup,
          [product.id]: {
            ...product,
            addedQty: quantity,
          },
        };
        Object.values(tempData)
          .filter((product) => product.addedQty > 0)
          .forEach((product) => (count += product.addedQty));

        setProductsMapped({
          ...tempData,
        });
        setBackup({
          ...bkTempData,
        });
        setCartCount(count);
      }
    },
    [backup, cartCount, openSnackbar, productsMapped]
  );

  const filterProducts = (event, selected, filter) => {
    const {
      target: { checked },
    } = event;
    const products = {
      ...productsMapped,
    };
    const tempProducts = Object.values(products).filter(
      (product) => product[filter] === selected
    );
    const productsHash = productHashFn(tempProducts);
    setProductsMapped({
      ...(checked && { ...productsHash }),
      ...(!checked && { ...backup }),
    });
  };

  const matchFn = (values, filterBy, input) => {
    const p = Array.from(input).reduce(
      (a, v, i) => `${a}[^${input.substr(i)}]*?${v}`,
      ""
    );
    const re = RegExp(p);
    return values.filter((v) => v[filterBy].toLowerCase().match(re));
  };

  const filterRepeative = (obj) => {
    const uniques = [];
    const stringify = {};
    for (let i = 0; i < obj.length; i++) {
      let keys = Object.keys(obj[i]);
      keys.sort(function (a, b) {
        return a - b;
      });
      let str = "";
      for (let j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }
    return uniques;
  };

  const searchFilters = (event) => {
    const {
      target: { value: rawValue },
    } = event;
    const value = rawValue.toLowerCase();
    if (value.length > 2) {
      const productsObj = {
        ...productsMapped,
      };
      const products = Object.values(productsObj);
      const name = matchFn(products, "name", value);
      const color = matchFn(products, "color", value);
      const type = matchFn(products, "type", value);
      // const name = products.filter((product) =>
      //   product.name.toLowerCase().includes(value)
      // );
      // const color = products.filter((product) =>
      //   product.color.toLowerCase().includes(value)
      // );
      // const type = products.filter((product) =>
      //   product.type.toLowerCase().includes(value)
      // );
      
      const filteredRepeative = filterRepeative([...name, ...color, ...type]);
      const productsHash = productHashFn(filteredRepeative);
      setProductsMapped({ ...productsHash });
    } else {
      setProductsMapped({ ...backup });
    }
  };

  const contextValue = {
    productsLoading,
    productsLoaded,
    productsMapped,
    cartCount,
    colorFilter,
    genderFilter,
    typeFilter,
    priceFilter,
    searchFilters,
    filterProducts,
    fetchProducts,
    addToBag,
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
export default ProductsProvider;
