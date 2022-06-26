import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import helperConfig from "../helper-config.json";

const appName = helperConfig.appShortName;

function Copyright() {
  return (
    <Typography variant="body2" color="grey.500">
      {"Copyright © "}
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "} */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        bgcolor: "grey.700",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" color="grey.50">
          {appName} - Enhanced DeFi Hub
        </Typography>
        <Copyright />
      </Container>
    </Box>
  );
};
