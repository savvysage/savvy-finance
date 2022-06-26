import { Box, Container, CssBaseline, Stack } from "@mui/material";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { ResponsiveAppBar } from "./components/ResponsiveAppBar";

function App() {
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
