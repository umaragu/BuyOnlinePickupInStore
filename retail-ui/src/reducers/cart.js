import { ADD_TO_CART, EMPTY_CART, REMOVE_FROM_CART } from "../constants";

export const cart = (
  state = { cartItems: JSON.parse(localStorage.getItem("cartItems") || "[]") },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      return { cartItems: action.payload.cartItems };
    case REMOVE_FROM_CART:
    case EMPTY_CART:
      return { cartItems: action.payload.cartItems };
    default:
      return state;
  }
};
