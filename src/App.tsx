import { Box, Container, CssBaseline, Stack } from "@mui/material";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { ResponsiveAppBar } from "./components/ResponsiveAppBar";

function App() {
  const { enableWeb3, isWeb3Enabled, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    const connectorId = localStorage.getItem("connectorId");
    if (!isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({
        provider: connectorId === "walletconnect" ? "walletconnect" : undefined,
      });
  }, [isWeb3Enabled]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <ResponsiveAppBar />
      <Container
        component="main"
        sx={{ my: { xs: "5%", md: "3.75%", xl: "2.5%" } }}
        maxWidth="xl"
      >
        <Stack spacing={2}>
          <Header />
          <Main />
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
