import { Box } from "@radix-ui/themes";

export default function BoxLayout({ children }) {
  return (
    <Box height="128px" width="256px">
      {children}
    </Box>
  );
}
