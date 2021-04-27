import axios from "axios";

export const getRequest = async (path, params) => {
  const url = process.env.REACT_APP_BACKEND_URL + path;
  return await axios.get(url, {
    params: params,
  });
};

export const postRequest = async (path, data) => {
  const url = process.env.REACT_APP_BACKEND_URL + path;
  return await axios.post(url, data);
};
