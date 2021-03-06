import { LIST_STORES, SET_STORE } from "../constants";

export const setStore = (store) => (dispatch, getState) => {
  const store = getState().store;
  dispatch({
    type: SET_STORE,
    payload: { store },
  });
  localStorage.setItem("store", JSON.stringify(store));
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
