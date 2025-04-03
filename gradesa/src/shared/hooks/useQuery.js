import axios from "axios";
import { stringify } from "qs";
import { useState, useEffect, useRef, useMemo } from "react";
import { useIsMounted } from "./useIsMounted";
import { useUser } from "@/context/user.context";

const baseUrl =
  process.env.NEXT_ENV === "production"
    ? "https://tbd.com"
    : "http://localhost:3000";
export const axiosInstance = axios.create({
  baseURL: `${baseUrl}/api`,
});

/**
 * @description This function converts an object to a query string.
 * @param {Object} obj - The object to convert to a query string.
 * @returns {string} - The query string.
 */
const objectToQueryString = (obj) => {
  return stringify(obj, { encodeValuesOnly: true });
};

const defaultConfig = {
  enabled: true,
  refetchBackoffMax: 10_000,
  refetchBackoff: 1000,
  refetchBackoffExponent: 1.5,
  refetchBackoffMaxAttempts: 3,
};

/**
 * @description This hook is used to fetch data from the server.
 * @param {string} url - The URL to fetch data from.
 * @param {Object} params - The parameters to send to the server.
 * @param {Object} config - The config object.
 * @returns {Object} - The data from the server.
 */
const useQuery = (url, params, config) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useUser();
  const isMounted = useIsMounted();

  const memoizedConfig = useMemo(() => {
    if (!config) return defaultConfig;
    return { ...defaultConfig, ...config };
  }, [config]);

  const currentAttemptRef = useRef(0);
  const currentBackoffRef = useRef(memoizedConfig.refetchBackoff);

  const memoizedQueryString = useMemo(() => {
    return params ? objectToQueryString(params) : null;
  }, [params]);

  const makeGetRequest = async (url, queryString, abortCtrl) => {
    if (!isMounted) {
      abortCtrl.abort();
    }
    setIsLoading(true);
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    const response = await axiosInstance.get(fullUrl, {
      signal: abortCtrl.signal,
    });
    if (isMounted && !!response.data) {
      setData(response.data);
    } else {
      throw new Error("Failed to fetch data");
    }
  };

  const retryWithBackoff = async (url, queryString, config, abortCtrl) => {
    // Reset attempt and backoff on each call
    currentAttemptRef.current = 0;
    currentBackoffRef.current = config.refetchBackoff;
    setError(null);
    let exponent = 1;
    const maxAttempts = config.refetchBackoffMaxAttempts;
    const maxBackoff = config.refetchBackoffMax;
    try {
      setIsLoading(true);
      while (
        currentAttemptRef.current < maxAttempts &&
        isMounted &&
        !abortCtrl.signal.aborted
      ) {
        try {
          await makeGetRequest(url, queryString, abortCtrl);
          // If succeeded, exit the loop
          break;
        } catch (error) {
          // If we've reached the max attempts, rethrow
          if (currentAttemptRef.current >= maxAttempts - 1) {
            throw error;
          }
          currentAttemptRef.current += 1;

          // Exponential backoff
          currentBackoffRef.current = Math.min(
            currentBackoffRef.current * exponent,
            maxBackoff
          );
          // Set the exponent for the next attempt
          // Set to 1 for the first attempt to make the initial
          // backoff equal to the base backoff
          exponent = memoizedConfig.refetchBackoffExponent;
          // Wait for the backoff duration
          await new Promise((resolve) =>
            setTimeout(resolve, currentBackoffRef.current)
          );
        }
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    let abortCtrl = new AbortController();
    await retryWithBackoff(url, memoizedQueryString, memoizedConfig, abortCtrl);
  };

  /**
   * @description This effect is used to create a new abort controller and make a get request.
   */
  useEffect(() => {
    if (!memoizedConfig.enabled) {
      return;
    }
    let abortCtrl = new AbortController();
    (async () => {
      await retryWithBackoff(
        url,
        memoizedQueryString,
        memoizedConfig,
        abortCtrl
      );
    })();
    return () => {
      abortCtrl.abort();
    };
  }, [url, memoizedQueryString, memoizedConfig, auth.user?.id]);

  return { data, error, isLoading, refetch };
};

export default useQuery;
