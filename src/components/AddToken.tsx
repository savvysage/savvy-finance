import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { AddTokenForm } from "./AddTokenForm";
import { Token } from "./Main";
import { ConnectWallet } from "./Wallet/ConnectWallet";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";

export const AddToken = (props: {
  tokens: Token[];
  tokensAreUpdated: boolean;
}) => {
  const { tokens, tokensAreUpdated } = props;
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
    <Box textAlign="right" my="1.5%">
      <Button variant="contained" onClick={handleClickOpen}>
        <AddCircleIcon />
        &nbsp; Add Token
      </Button>
      <Dialog aria-label="add token" open={open}>
        <DialogTitle>
          Add Token
          <IconButton
            aria-label="close add token"
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
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <AddTokenForm tokens={tokens} tokensAreUpdated={tokensAreUpdated} />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          {!walletIsConnected ? (
            <ConnectWallet />
          ) : (
            <Button variant="contained" size="large" onClick={handleClose}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
