import { useMemo } from "react";
export const useSchema = (value, schema) => {
  return useMemo(() => schema.parse(value), [value, schema]);
};
