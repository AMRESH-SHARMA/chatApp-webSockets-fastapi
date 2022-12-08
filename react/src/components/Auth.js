import jwt_decode from "jwt-decode";

export default function TokenExpired(inputToken) {
  let token = inputToken;
  const { exp } = jwt_decode(token);
  const expirationTime = (exp * 1000) - 60000;
  if (Date.now() >= expirationTime) {
    return true
  } else return false
}