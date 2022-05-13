// Extract the Jwts
export const extractJwts = (jwt) => {
  let tokens = jwt.split(".");
  let payloads = JSON.parse(atob(tokens[1]));

  return payloads;
};
