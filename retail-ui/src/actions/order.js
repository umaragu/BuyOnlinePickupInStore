import { DISPLAY_MESSAGE, CREATE_ORDER, EMPTY_CART, CLEAR_ORDER, LIST_ORDERS } from "../constants";
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: process.env.REACT_APP_API_RETRY });
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});

export const createOrder = (order, user) => async (dispatch) => {
  let res;
  try {
     const options = {
       headers: {
         "Authorization": user.signInUserSession.accessToken.jwtToken
       }
     }
     res =  await axios.post(process.env.REACT_APP_ORDER_API+"/order", order,options) ;
  
  } catch(error) {
    console.log("Error creating order ",res )
    dispatch({ type: DISPLAY_MESSAGE, payload: "Error Creating Order. Please retry at a later time"});
    return;
  }
  let cartItems = []

  dispatch({ type: EMPTY_CART, payload: { cartItems } });
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  dispatch({ type: CREATE_ORDER, payload: res.data });


};
export const clearOrder = () => async (dispatch) => {
  let cartItems = []

  dispatch({ type: EMPTY_CART, payload: { cartItems }});
  dispatch({ type: CLEAR_ORDER });

};
export const fetchOrders = (customerId, user) => async (dispatch) => {
  const options = {
    headers: {
      "Authorization": user.signInUserSession.accessToken.jwtToken
    }
  }
  const res =  await axios.get(process.env.REACT_APP_ORDER_API+"/order?customer_id="+customerId,options);
  dispatch({ type: LIST_ORDERS, payload: res.data });
};
