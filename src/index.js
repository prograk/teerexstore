import React from "react";
import ReactDOM from "react-dom/client";
import SnackbarProvider from 'react-simple-snackbar'
import "bootstrap/scss/bootstrap.scss";
import "font-awesome/scss/font-awesome.scss";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import ProductsProvider from "src/Providers/ProductsProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Bag from "./Pages/Bag/Bag";
import Header from "src/Components/Header";
import ResponsiveProvider from "./Providers/ResponsiveProvier";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ResponsiveProvider>
    <SnackbarProvider>
      <ProductsProvider>
        <Router basename="/teerexstore">
          <Header />
          <div className="container">
            <Routes>
              <Route exact="true" path="/" element={<Home />} />
              <Route exact="true" path="/bag" element={<Bag />} />
            </Routes>
          </div>
        </Router>
      </ProductsProvider>
    </SnackbarProvider>
  </ResponsiveProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
