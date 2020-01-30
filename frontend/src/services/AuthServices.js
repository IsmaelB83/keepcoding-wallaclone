// NPM Modules
import Axios from 'axios';
import Querystring from 'querystring';

// Material UI
// Own modules
import Session from '../models/Session';
// Assets
// CSS

// Endpoint
const API_URL = 'https://127.0.0.1:8443/apiv1';

/**
* Objeto API
*/
export default {
  
  /**
  * Trata de hacer login contra el API
  */
  login: (email, password) => {
    // Endpoint
    let baseURL = `${API_URL}/authenticate`;
    // Call endpoint and return
    return Axios.post(
      baseURL, 
      Querystring.stringify({ email: email, password: password }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then(res => new Session(res.data.user));
  },

  /**
  * Trata de hacer login contra el API
  */
  logout: (jwt) => {
    // Endpoint
    let baseURL = `${API_URL}/authenticate/logout`;
    // Call endpoint and return
    return Axios.post(
      baseURL, 
      { headers: { 'Authorization': `Bearer ${jwt}`} }
    )
    .then(res => 'JWT invalidated');
  },

  /**
  * Trata de hacer login contra el API
  */
  loginWithToken: (jwt) => {
    // Endpoint
    let baseURL = `${API_URL}/authenticate/checkjwt`;
    // Call endpoint and return
    return Axios.post(
      baseURL, 
      { headers: { 'Authorization': `Bearer ${jwt}`} }
    )
    .then(res => new Session(res.data.user));
  },


  /**
  * Solicita reseteo de contraseña
  */
  activate: (token) => {
    // Endpoint
    let baseURL = `${API_URL}/authenticate/activate/${token}`;
    // Call endpoint and return
    return Axios.get(
      baseURL,
    )
    .then(res => res);
  },

  /**
  * Solicita reseteo de contraseña
  */
  resetRequest: (email) => {
    // Endpoint
    let baseURL = `${API_URL}/authenticate/reset`;
    // Call endpoint and return
    return Axios.post(
      baseURL, 
      Querystring.stringify({ email: email }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then(res => res);
  },

  /**
  * Resetea la contraseña
  */
  reset: (token, password) => {
    // Endpoint
    let baseURL = `${API_URL}/authenticate/reset/${token}`;
    // Call endpoint and return
    return Axios.post(
      baseURL, 
      Querystring.stringify({ password: password }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then(res => res);
  },
}