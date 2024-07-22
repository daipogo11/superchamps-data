import axios from 'axios';

import CONSTANTS from '@/common/constants';

const TOKEN_URL = '/user-management/web/newAccessAndRefreshToken';

const API_PREFIX = ''
export const httpClient = axios.create({
  baseURL: API_PREFIX,
  headers: { 'JRX-APP-ID': CONSTANTS.JRX_APP_ID },
  withCredentials: true,
});

const refreshAccessToken = async () => {
  await httpClient.post<null>(TOKEN_URL);

  return false;
};

let isTokenRefreshing: boolean | Promise<boolean> = false;

httpClient.interceptors.response.use(
  (res) => res,
  async function (error) {
    const originalRequest = error.config;
    const status = error && error.response ? error.response.status : -1;

    if (
      status === 401
    ) {
      if (!originalRequest._retry && originalRequest.url !== TOKEN_URL) {
        originalRequest._retry = true;

        if (typeof isTokenRefreshing !== 'boolean') {
          // If token is already being refreshed, wait for it to finish
          isTokenRefreshing = await isTokenRefreshing;
        } else {
          // If token is not being refreshed, refresh it
          isTokenRefreshing = refreshAccessToken();
          isTokenRefreshing = await isTokenRefreshing;
        }

        return httpClient(originalRequest);
      }
    }

    return Promise.reject(error ? error.response : error);
  },
);
