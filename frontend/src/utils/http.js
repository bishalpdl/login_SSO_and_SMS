import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_LOCAL_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers["Authorization"] = `Bearer `;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
