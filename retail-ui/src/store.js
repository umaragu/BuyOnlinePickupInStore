import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import { product } from "./reducers/product";
import { order } from "./reducers/order";
import { cart } from "./reducers/cart";

const initialState = {};
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    products: product,
    order: order,
    cart: cart
  }),
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);
export default store;
