import React, { Component } from "react";
import { connect } from "react-redux";
import { STORES } from "../constants";
import { filterProducts } from "../actions/Products";
import UserContext from '../UserContext'

class Stores extends Component {
  static contextType = UserContext;
  render() {
    return !this.props.filteredProducts ? (
      <div>Loading...</div>
    ) : (
      <div className="filter">
        <div className="filter-result">
          {this.props.filteredProducts.length} You are shopping at
        </div>
        <div className="filter-size">
          <select
            onChange={(e) =>
              this.props.filterProducts(e.target.value, this.context.user)
            }
          >              
          {STORES.map((store) => (
            <option value={store.store}>{store.store} - {store.address}</option> 
            ))}
          </select>
        </div>
      </div>
    );
  }
}
export default connect(
  (state) => ({
    store: state.products.store,
    products: state.products.items,
    filteredProducts: state.products.filteredItems,
  }),
  {
    filterProducts
  }
)(Stores);
