import axios from 'axios';
import { API_URL } from '../constants/AxiosConstans';

axios.defaults.headers.common['X-Key-Inflection'] = 'camel';
axios.defaults.headers.common['access-token'] = '';
axios.defaults.headers.common.client = '';
axios.defaults.headers.common.uid = '';
delete axios.defaults.headers.common['access-token'];
delete axios.defaults.headers.common.client;
delete axios.defaults.headers.common.uid;

export function clearToken() {
  localStorage.removeItem('auth_token');
}

export function storeToken(authValues) {
  localStorage.auth_token = JSON.stringify(authValues);
}

export function storeNewToken(headers) {
  const token = localStorage.getItem('auth_token');
  let parsedToken = {};

  // if there is already a token but the one in the headers exists
  // and is different than the one we have
  // and will last longer than the one we have
  // we store the new token
  // if there is no token we store the token we received
  if (token) {
    parsedToken = JSON.parse(token);
  }

  if (
    (token
      && headers['access-token']
      && parsedToken.access_token !== headers['access-token']
      && parsedToken.expiry < headers.expiry)
    || !token
  ) {
    const authValues = {
      access_token: headers['access-token'],
      client: headers.client,
      uid: headers.uid,
      expiry: headers.expiry,
    };

    localStorage.auth_token = JSON.stringify(authValues);
  }
}

export function errorHandler(dispatch, error, type, message = null) {
  const errorObj = { type, message };

  if (error) {
    storeNewToken(error.headers);

    if (error.data.errors) {
      const errors = error.data.errors;
      if (Object.prototype.toString.call(errors) === '[object Array]') {
        errorObj.message = errors[0];
      } else {
        errorObj.payload = Object.keys(errors).map(key => ({ key, message: msg }));
      }
    }
  }
  dispatch(errorObj);
}

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');

  if (token) {
    const parsedToken = JSON.parse(token);

    return {
      'access-token': parsedToken.access_token,
      client: parsedToken.client,
      uid: parsedToken.uid,
    };
  }
  return {};
}

export function get(url) {
  const headers = getAuthHeaders();

  return axios({
    url: `${API_URL}${url}`,
    method: 'GET',
    headers,
  })
    .then((result) => {
      storeNewToken(result.headers);
      return { result, resultType: 'success' };
    })
    .catch((error) => {
      storeNewToken(error.response);
      return { result: error.response, resultType: 'error' };
    });
}

export function post(url, body) {
  const headers = getAuthHeaders();

  return axios({
    url: `${API_URL}${url}`,
    method: 'POST',
    headers,
    data: body,
  })
    .then((result) => {
      storeNewToken(result.headers);
      return { result, resultType: 'success' };
    })
    .catch((error) => {
      storeNewToken(error.response);
      return {
        result: error.response,
        resultType: 'error',
        reason: error.response.reason,
      };
    });
}

export function put(url, body, externalConfig = {}) {
  const headers = {
    ...externalConfig.headers,
    ...getAuthHeaders(),
  };

  delete externalConfig.headers;

  return axios({
    url: `${API_URL}${url}`,
    method: 'PUT',
    headers,
    data: body,
    ...externalConfig,
  })
    .then((result) => {
      storeNewToken(result.headers);
      return { result, resultType: 'success' };
    })
    .catch((error) => {
      storeNewToken(error.response);
      return { result: error.response, resultType: 'error' };
    });
}

export function del(url, body) {
  const headers = getAuthHeaders();

  return axios({
    url: `${API_URL}${url}`,
    method: 'DELETE',
    headers,
    data: body,
  })
    .then((result) => {
      storeNewToken(result.headers);
      return { result, resultType: 'success' };
    })
    .catch((error) => {
      storeNewToken(error.response);
      return { result: error.response, resultType: 'error' };
    });
}
