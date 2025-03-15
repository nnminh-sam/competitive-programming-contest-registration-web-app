import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";

const Api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

Api.interceptors.request.use((config) => {
  if (!config.headers) {
    return config;
  }

  const token = localStorage.getItem("token") || "";
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders,
    };
  }

  return config;
});

Api.interceptors.response.use(
  (res: any) => {
    return res;
  },
  function (err) {
    const status = err?.response?.status;
    const message = err?.response?.data?.message;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/sign-in";
    }
    return Promise.reject(new Error(message));
  },
);

export default Api;
