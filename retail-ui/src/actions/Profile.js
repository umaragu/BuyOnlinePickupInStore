import { USER_PROFILE, CLEAR_USER_PROFILE } from "../constants";

export const setProfile = (profile) => (dispatch, getState) => {
  const userProfile = getState().userProfile;
  dispatch({
    type: USER_PROFILE,
    payload: { userProfile },
  });
  localStorage.setItem("userProfile", JSON.stringify(userProfile));
};

export const clearProfile = (profile) => (dispatch, getState) => {
  const userProfile = []
  dispatch({ type: CLEAR_USER_PROFILE, payload: { userProfile } });
  localStorage.setItem("userProfile", JSON.stringify(userProfile));
};
