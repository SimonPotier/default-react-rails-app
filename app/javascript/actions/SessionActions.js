import * as types from '../constants/ActionTypes';

// import {
//   API_URL,
//   errorHandler,
//   get,
//   post,
//   put,
//   del,
//   storeNewToken,
//   storeToken,
//   clearToken,
//   paginateObject,
// } from './common';

//= ===============================
// Authentication actions
//= ===============================

export const initAuth = () => (dispatch) => {
  const authToken = localStorage.getItem('auth_token');
  if (authToken) {
    const parsedToken = JSON.parse(authToken);
    if (parsedToken.access_token && parsedToken.expiry * 1000 > Date.now()) {
      // dispatch(fetchSessionData(authToken));
    }
  }
};

export const something = (params1, params2) => ({
  type: types.SOMETHING,
  params1,
  params2,
});
