import { Box } from "@mui/system";
import { Typography } from "@mui/material";

export const Header = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(139.73deg, rgb(229, 253, 255) 0%, rgb(243, 239, 255) 100%)",
        px: "10%",
        py: "2.5%",
        borderRadius: 7.5,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{ color: "primary.main", fontWeight: "bold" }}
      >
        Staking
      </Typography>
      <Typography
        component="h2"
        sx={{ color: "secondary.main", fontWeight: "bold" }}
      >
        Stake Tokens / LP Tokens. <br /> Earn rewards in any token.
      </Typography>
    </Box>
  );
};
