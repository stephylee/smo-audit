import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "./config";

/**
*  Déconnexion (suppression du token du localStorage et sur axios)
*/
function logout() {
    window.localStorage.removeItem('authToken');
    delete axios.defaults.headers["Authorization"];
}

/**
 * Positionne le token JWT sur axios
 * @param {string} token le token JWT
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Requette HTTP d'authentification et stockage du token dans le storage et sur axios
 * @param {object} credentials 
 */
function  authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            // On prévient Axios qu'on a maintenant un header par défaut pour toutes nos requetes HTTP
            setAxiosToken(token);
        })
}
 /**
  * Mise en place lors du chargement de l'application
  */
function setup() {
    // voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // si le token est encore valide alors on va donner le token à axios
    if(token) {
        const { exp: expiration } = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou pas.
 * @returns boolean
 */
function isAuthenticated() {
    // voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // si le token est encore valide alors on va donner le token à axios
    if(token) {
        const { exp: expiration } = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};
