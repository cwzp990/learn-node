import axios from "axios";

const BASE_URL = "http://localhost:7001";

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
