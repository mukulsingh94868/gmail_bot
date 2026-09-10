export const decodeJWT = (token) => {
  try {
    const base64Payload = token?.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch (err) {
    return null;
  }
};