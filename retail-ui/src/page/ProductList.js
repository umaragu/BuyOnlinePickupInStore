import React, { Component } from "react";
import Stores from "../components/Stores";
import Products from "../components/Products";
import Cart from "../components/Cart";

export default class ProductList extends Component {
  render() {
    return (
      <div>
        <div className="content">
          <div className="main">
            <Stores></Stores>
            <Products></Products>
          </div>
          <div className="sidebar">
            <Cart />
          </div>
        </div>
      </div>
    );
  }
}