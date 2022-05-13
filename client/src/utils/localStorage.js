export const getLocalToken = () => {
  return localStorage.getItem("token");
};

export const setLocalToken = (token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

export const removeLocalToken = () => {
  localStorage.removeItem("token");
};
