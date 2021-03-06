import {  CREATE_ORDER, CLEAR_ORDER, LIST_ORDERS, DISPLAY_MESSAGE } from "../constants";

const order = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER:
      return { order: action.payload };
    case CLEAR_ORDER:
      return { order: null };
    case LIST_ORDERS:
      return { orders: action.payload };
    case DISPLAY_MESSAGE:
      return { order: action.payload };
      default:
      return state;
  }
};
export { order };