const isBrowser = () => typeof window !== "undefined";

export const saveToken = async (token: string) => {
  if (isBrowser()) {
    localStorage.setItem("token", token);
  }
};

export const logout = () => {
  if (isBrowser()) {
    localStorage.removeItem("token");
  }
};

export const getUser = () => {
  if (isBrowser()) {
    const token = localStorage.getItem("token");
    console.log(token);
    return token;
  }
  return null;
};