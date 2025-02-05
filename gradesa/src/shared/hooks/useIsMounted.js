import { useEffect, useRef } from "react";

/**
 * @description This hook is used to check if the component is mounted.
 * This is useful to prevent state updates on an unmounted component.
 * @returns {boolean} - True if the component is mounted, false otherwise.
 */
export const useIsMounted = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted.current;
};
