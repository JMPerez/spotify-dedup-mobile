import Login from './login';

export const showLogin = forceUser => {
  return dispatch => {
    return Login(forceUser).then(accessToken => {
      dispatch(authSuccess(accessToken));
      dispatch(fetchMe());
    });
  };
};

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export function authSuccess(accessToken) {
  return {
    type: AUTH_SUCCESS,
    accessToken
  };
}

export const FETCH_ME = 'FETCH_ME';
export const FETCH_ME_SUCCESS = 'FETCH_ME_SUCCESS';
export const fetchMe = () => {
  return {
    type: FETCH_ME
  };
};
export const fetchMeSuccess = user => {
  return {
    type: FETCH_ME_SUCCESS,
    user
  };
};

export function sessionReducer(state = {}, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return { ...state, accessToken: action.accessToken };
    case FETCH_ME_SUCCESS:
      return { ...state, username: action.user.display_name || action.user.id };
    default:
      return state;
  }
}

// export selectors
export const isLoggedIn = state => state.accessToken !== undefined;
export const getUsername = state => state.username;
