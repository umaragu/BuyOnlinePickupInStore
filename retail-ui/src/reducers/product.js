import {
    LIST_PRODUCTS,
    ORDER_BY_PRICE,
  } from "../constants";
  
  export const product = (
    state = { store: JSON.parse(localStorage.getItem("store") || "{}") },
    action) => {
    switch (action.type) {
      case ORDER_BY_PRICE:
        return {
          ...state,
          sort: action.payload.sort,
          filteredItems: action.payload.items,
          store: action.payload.store
        };
      case LIST_PRODUCTS:
        return { 
            items: action.payload.items, 
            filteredItems: action.payload.items,           
            store: action.payload.store
        };
      default:
        return state;
    }
  };
  