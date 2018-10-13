import * as types from '../constants/ActionTypes';

const initialState = {
  id: null,
  authToken: null,
};

const session = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN:
      return {
        ...state,
        oauthToken: action.authToken,
      };

    case types.LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
};

export default session;
