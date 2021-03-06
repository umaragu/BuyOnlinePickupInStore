import React, { Component } from "react";
import OrderList from "../components/OrderList";

export default class Orders extends Component {
  render() {
    return (
      <div>
        <div className="content">
          <div className="main">
            <OrderList></OrderList>
          </div>
        </div>
      </div>
    );
  }
}