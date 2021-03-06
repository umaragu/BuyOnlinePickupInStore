import {
  CLEAR_USER_PROFILE,
  USER_PROFILE,
  } from "../constants";
  
  
  export const setProfile = (state = { userProfile: JSON.parse(localStorage.getItem("userProfile") || "[]") }
  , action) => {
    switch (action.type) {
      case CLEAR_USER_PROFILE:
        return { userProfile: action.payload.userProfile};
      case USER_PROFILE:
        return { userProfile: action.payload.userProfile};
      default:
        return state;
    }
  };
  