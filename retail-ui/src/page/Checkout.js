import React, { Component } from "react";
// import Filter from "../components/Sort";
import Cart from "../components/Cart";

export default class Checkout extends Component {
  render() {
    return (
      <div>
        <div className="content">
          <div className="main">
            {/* <Filter></Filter> */}
            <Cart checkout="main"/>
          </div>
        </div>
      </div>
    );
  }
}