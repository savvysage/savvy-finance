import { Box, Container, CssBaseline, Stack } from "@mui/material";
import { useEffect, useReducer } from "react";
import { useMoralis } from "react-moralis";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { ResponsiveAppBar } from "./components/ResponsiveAppBar";

function App() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const { Moralis, enableWeb3, isWeb3Enabled, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    Moralis.onWeb3Enabled((result) => console.log(result));
    Moralis.onWeb3Deactivated((result) => console.log(result));
    Moralis.onAccountChanged((chain) => console.log(chain));
  }, []);

  // useEffect(() => {
  //   const connectorId = localStorage.getItem("connectorId");
  //   if (!isWeb3Enabled && !isWeb3EnableLoading)
  //     enableWeb3({
  //       provider: connectorId === "walletconnect" ? "walletconnect" : undefined,
  //     });
  // }, [isWeb3Enabled]);

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
