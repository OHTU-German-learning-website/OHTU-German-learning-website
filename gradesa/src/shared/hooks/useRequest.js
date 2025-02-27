import { axiosInstance } from "./useQuery";

const defaultConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export const useRequest = () => {
  /**
   * @description This hook is used to make a request to the server.
   * Mainly used for non-GET requests.
   * @param {string} url - The URL to make the request to.
   * @param {Object} body - The body of the request.
   * @param {Object} config - The config of the request.
   * @returns {Object} - The response from the server.
   */
  return async (url, body, config) => {
    try {
      const response = await axiosInstance.request({
        url,
        data: body,
        ...defaultConfig,
        ...config,
      });

      return response;
    } catch (error) {
      if (error.response && error.response.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error("An unexpected error occurred.");
      }
    }
  };
};
