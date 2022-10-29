import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getProducts } from "src/api";
import useLoadingApi from "src/utils/useLoadingApi";
import { useSnackbar } from "react-simple-snackbar";

const ProductsContext = createContext({});

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState({});
  const [productsMapped, setProductsMapped] = useState({});
  const [backup, setBackup] = useState({});
  const [colorFilter, setColorFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [priceFilter] = useState(["0-250", "250-450", "450+"]);
  const [sort, setSort] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  // const [selectedPrice, setSelectedPrice] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [openSnackbar] = useSnackbar();

  const getFilters = (products) => {
    const colors = new Set();
    const genders = new Set();
    // const prices = new Set();
    const types = new Set();
    Object.values(products).forEach((product) => {
      colors.add(product.color);
      genders.add(product.gender);
      // prices.add(product.price);
      types.add(product.type);
    });
    setColorFilter([...Array.from(colors).sort((a, b) => a - b)]);
    setGenderFilter([...Array.from(genders).sort((a, b) => a - b)]);
    // setPriceFilter(['0-250', '251 - 450', '451+'])
    // setPriceFilter([...Array.from(prices).sort((a, b) => a - b)]);
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
  };

  const getProductsCallback = useCallback(async () => {
    await getProducts()
      .then((res) => {
        const productsHash = productHashFn(res);
        getFilters(productsHash);
        setProducts(res);
        setProductsMapped(productsHash);
        setBackup(productsHash);
      })
      .catch((err) => {
        setProducts([]);
        setProductsMapped({});
        setBackup({});
      });
  }, [setProductsMapped]);

  const {
    call: fetchProducts,
    loading: productsLoading,
    loaded: productsLoaded,
  } = useLoadingApi(getProductsCallback);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToBag = useCallback(
    ({ id, qty = 1 }) => {
      let product, index;
      const rawProducts = [...products];

      rawProducts.forEach((prod, ind) => {
        if (prod.id === id) {
          product = prod;
          index = ind;
        }
      });

      if (!product) return;
      let { addedQty = 0, quantity: productQty } = rawProducts[index];

      if (addedQty === productQty && qty > 0) {
        openSnackbar("Product quantity exceeded");
        return;
      }

      rawProducts[index] = {
        ...rawProducts[index],
        addedQty: addedQty + qty,
      }

      const productsHash = productHashFn(rawProducts);
      setProducts([...rawProducts]);
      setCartCount((prev) => prev + qty);
      setBackup(productsHash);

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products]
  );

  const filterProducts = (event, selected, filter) => {
    const {
      target: { checked },
    } = event;

    if (checked) {
      const filterValues = [...selectedValues, selected];
      setSelectedValues(filterValues);
    } else {
      const filterValues = [...selectedValues.filter((sv) => sv !== selected)];
      setSelectedValues(filterValues);
    }
    setCurrentFilter(filter);
  };

  const filterProductFun = () => {
    if (selectedValues.length === 0) {
      const products = Object.values(backup);
      setProducts(products);
      setProductsMapped({ ...backup });
      return;
    }

    const products = {
      ...backup,
    };

    // eslint-disable-next-line array-callback-return
    let tempProducts = Object.values(products).filter((product) => {
      const { color, gender, type } = product;
      if (selectedValues.indexOf(color) !== -1) {
        return product;
      }
      if (selectedValues.indexOf(gender) !== -1) {
        return product;
      }
      if (selectedValues.indexOf(type) !== -1) {
        return product;
      }
      if (selectedValues.indexOf("0-250") !== -1) {
        return product.price <= 250;
      }
      if (selectedValues.indexOf("250-450") !== -1) {
        return product.price >= 251 && product.price <= 450;
      }
      if (selectedValues.indexOf("450+") !== -1) {
        return product.price >= 451;
      }
    });

    const data = sortProducts(tempProducts);

    const productsHash = productHashFn(data);
    setProducts(data);
    setProductsMapped({ ...productsHash });
  };

  const sortFilter = (event) => {
    const { value } = event.target;
    setSort(value);
    sortProducts();
    const rawProducts = sortProducts();
    const products = productHashFn(rawProducts);
    setProducts(rawProducts);
    setProductsMapped({ ...products });
  };

  const sortProducts = (productsData = { ...backup }) => {
    return Object.values(productsData).sort((a, b) =>
      sort === "lowprice" ? a.price - b.price : b.price - a.price
    );
  };

  useEffect(() => {
    filterProductFun(currentFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues, currentFilter]);

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

      const filteredRepeative = filterRepeative([...name, ...color, ...type]);
      const data = sortProducts(filteredRepeative);
      const productsHash = productHashFn(data);
      setProducts(data);
      setProductsMapped({ ...productsHash });
    } else {
      const data = sortProducts(backup);
      setProducts(data);
      setProductsMapped({ ...backup });
    }
  };

  const contextValue = {
    productsLoading,
    productsLoaded,
    productsMapped,
    products,
    backup,
    cartCount,
    colorFilter,
    genderFilter,
    typeFilter,
    priceFilter,
    sortFilter,
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
