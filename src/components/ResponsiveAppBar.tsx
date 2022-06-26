import { useState } from "react";
import { useMoralis } from "react-moralis";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { ConnectWallet } from "./Wallet/ConnectWallet";
import { shortenAddress } from "../common";
import { getExplorer } from "../helpers/networks";
import helperConfig from "../helper-config.json";

const appName = helperConfig.appShortName;
const pages = ["Staking"];
const settings = ["Disconnect"];

export const ResponsiveAppBar = () => {
  const {
    chainId,
    account: walletAddress,
    isAuthenticated: walletIsConnected,
    authenticate: connectWallet,
    logout: disconnectWallet,
  } = useMoralis();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AccountBalanceIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            component="a"
            href="/"
            noWrap
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {appName}
          </Typography>

          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="pages menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                mt: 2,
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AccountBalanceIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            component="a"
            href="/"
            noWrap
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: { xs: ".15rem", sm: ".3rem" },
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {appName}
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {!walletIsConnected ? (
            <ConnectWallet />
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Chip
                    icon={<AccountBalanceWalletIcon />}
                    label={`${shortenAddress(
                      walletAddress ?? helperConfig.zeroAddress
                    )} ${String.fromCharCode(0x25bc)}`}
                    color="secondary"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                sx={{ mt: 2 }}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography
                    component="a"
                    href={`${getExplorer(
                      chainId ?? ""
                    )}/address/${walletAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    textAlign="center"
                  >
                    View on Explorer
                  </Typography>
                </MenuItem>
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    {setting !== "Disconnect" ? (
                      <Typography textAlign="center">{setting}</Typography>
                    ) : (
                      <Typography
                        textAlign="center"
                        onClick={async () => {
                          await disconnectWallet();
                          localStorage.removeItem("connectorId");
                        }}
                      >
                        {setting}
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
