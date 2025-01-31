import axios from 'axios';
import { useState, useEffect } from 'react';
const baseUrl = process.env.NEXT_ENV === 'production' ? 'https://tbd.com' : 'http://localhost:3000';
const axiosInstance = axios.create({
  baseURL: `${baseUrl}/api`,
});

const makeRequest = async ({ url, config }) => {
  const response = await axiosInstance.get(url, config);
  return response.data;
};

const useQuery = ({ url, config }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    makeRequest({ url, config })
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }, [url, config]);

  return { data, error, isLoading: isLoading || !data };
};

export default useQuery;
