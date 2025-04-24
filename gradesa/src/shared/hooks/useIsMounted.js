import { useEffect, useState } from "react";

/**
 * @description This hook is used to check if the component is mounted.
 * This is useful to prevent state updates on an unmounted component.
 * @returns {boolean} - True if the component is mounted, false otherwise.
 */
export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);
  return mounted;
};
