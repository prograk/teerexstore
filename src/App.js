import SnackbarProvider from 'react-simple-snackbar';
import ProductsProvider from "src/Providers/ProductsProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Bag from "./Pages/Bag/Bag";
import Header from "src/Components/Header";
import ResponsiveProvider from "./Providers/ResponsiveProvier";

const App = () => (
  <ResponsiveProvider>
    <SnackbarProvider>
      <ProductsProvider>
        <Router basename="/teerexstore">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bag" element={<Bag />} />
            </Routes>
          </div>
        </Router>
      </ProductsProvider>
    </SnackbarProvider>
  </ResponsiveProvider>
);

export default App
