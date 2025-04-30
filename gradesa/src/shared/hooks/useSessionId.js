import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const getOrCreateSessionId = () => {
      const storedSessionId = localStorage.getItem("session_id");

      if (storedSessionId) {
        setSessionId(storedSessionId);
      } else {
        const newSessionId = uuidv4();
        localStorage.setItem("session_id", newSessionId);
        setSessionId(newSessionId);
      }
    };

    getOrCreateSessionId();
  }, []);

  return sessionId;
};
