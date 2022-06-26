import { useState } from "react";
import { useMoralis } from "react-moralis";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloseIcon from "@mui/icons-material/Close";
import { wallets } from "./config";
import helperConfig from "../../helper-config.json";

const appName = helperConfig.appShortName;

export const ConnectWallet = (props: {
  size?: "small" | "medium" | "large" | undefined;
}) => {
  const { size } = props;
  const {
    chainId,
    account: walletAddress,
    isAuthenticated: walletIsConnected,
    authenticate: connectWallet,
    logout: disconnectWallet,
  } = useMoralis();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button
        variant="contained"
        size={size ?? "medium"}
        color="secondary"
        onClick={handleClickOpen}
      >
        <AccountBalanceWalletIcon /> Connect
      </Button>
      <Dialog aria-label="connect wallet" open={open} onClose={handleClose}>
        <DialogTitle>
          Connect Wallet
          <IconButton
            aria-label="close connect wallet"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {wallets.map(({ name, icon, connectorId }, key) => (
              <Grid
                item
                xs={6}
                key={key}
                onClick={async () => {
                  try {
                    await connectWallet({
                      signingMessage: `${appName} Authentication`,
                      provider:
                        connectorId === "walletconnect"
                          ? "walletconnect"
                          : undefined,
                    });
                    localStorage.setItem("connectorId", connectorId);
                    handleClose();
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Avatar alt={name} src={icon} />
                </Box>
                <Typography variant="subtitle2" align="center">
                  {name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
