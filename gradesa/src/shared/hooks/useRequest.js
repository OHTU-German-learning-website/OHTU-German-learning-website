import { axiosInstance } from './useQuery';

const defaultConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * @description This hook is used to make a request to the server.
 * Mainly used for non-GET requests.
 * @param {string} url - The URL to make the request to.
 * @param {Object} body - The body of the request.
 * @param {Object} config - The config of the request.
 * @returns {Object} - The response from the server.
 */
export const useRequest = (url, body, config) => {
  return axiosInstance.request({
    url,
    data: body,
    ...defaultConfig,
    ...config,
  });
}