import { LIST_PRODUCTS, ORDER_BY_PRICE, STORES } from "../constants";
import axios from 'axios';
import axiosRetry from 'axios-retry';
axiosRetry(axios, { retries: process.env.REACT_APP_API_RETRY });
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay});

export const listProducts = (user) => async (dispatch) => {
  const store = STORES[0];
  // const options = {
  //   headers: {
  //     "Authorization": user.signInUserSession.accessToken.jwtToken
  //   }
  // }
  const res = await axios.get(process.env.REACT_APP_PRODUCT_API+"/products/"+store.store);
  dispatch({
    type: LIST_PRODUCTS,
    payload: {
      items: res.data,
      store: store
    }
  });
  localStorage.setItem("store", JSON.stringify(store));

};
export const filterProducts = (store,user) => async (dispatch) => {
  console.log(store);
  let storeObj;
  for(let item of STORES) {
    if(item.store === store) {
      storeObj = item;
      break;
    }
  }
  const res = await axios.get(process.env.REACT_APP_PRODUCT_API+"/products/"+store);
  dispatch({
    type: LIST_PRODUCTS,
    payload: {
      items: res.data,
      store: storeObj
    }
  });
  localStorage.setItem("store", JSON.stringify(storeObj));

};

export const sortProducts = (filteredProducts, sort) => (dispatch) => {
  const sortedProducts = filteredProducts.slice();
  // if (sort === "latest") {
  //   sortedProducts.sort((a, b) => (a._id > b._id ? 1 : -1));
  // } else {
    sortedProducts.sort((a, b) =>
      sort === "lowest"
        ? a.unit_price > b.unit_price
          ? 1
          : -1
        : a.unit_price > b.unit_price
        ? -1
        : 1
    );
  // }
  console.log(sortedProducts);
  dispatch({
    type: ORDER_BY_PRICE,
    payload: {
      sort: sort,
      items: sortedProducts,
    },
  });
};
