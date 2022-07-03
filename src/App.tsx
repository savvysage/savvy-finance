import { useEffect, useReducer } from "react";
import { useMoralis } from "react-moralis";
import { Box, Container, CssBaseline, Stack } from "@mui/material";
import { ResponsiveAppBar } from "./components/ResponsiveAppBar";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { Footer } from "./components/Footer";
import helperConfig from "./helper-config.json";

const appName = helperConfig.appShortName;

function App() {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const {
    Moralis,
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    chainId,
    account: walletAddress,
    isAuthenticated: walletIsConnected,
    authenticate: connectWallet,
    logout: disconnectWallet,
  } = useMoralis();

  useEffect(() => {
    const connectorId = localStorage.getItem("connectorId");
    if (connectorId && !isWeb3Enabled && !isWeb3EnableLoading)
      (async () => {
        await enableWeb3({
          provider: connectorId as "walletconnect" | undefined,
        });
      })();

    // Moralis.onWeb3Enabled((result) => console.log(result));
    // Moralis.onWeb3Deactivated((result) => console.log(result));
    Moralis.onAccountChanged(async (chain) => {
      try {
        await disconnectWallet();
        await connectWallet({
          signingMessage: `${appName} Authentication`,
          provider: connectorId as "walletconnect" | undefined,
        });
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

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
