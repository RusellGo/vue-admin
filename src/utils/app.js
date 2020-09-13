import cookie from "cookie_js";

const adminToken = "admin_token";
const usernameKey = "username";

export function getToken() {
  return cookie.get(adminToken);
}

export function setToken(token) {
  cookie.set(adminToken, token);
}

export function removeToken() {
  cookie.remove(adminToken);
}

export function getUsername() {
  return cookie.get(usernameKey);
}

export function setUsername(value) {
  cookie.set(usernameKey, value);
}

export function removeUsername() {
  cookie.remove(usernameKey);
}
