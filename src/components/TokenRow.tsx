import {
  Avatar,
  Badge,
  Collapse,
  IconButton,
  Stack,
  styled,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { numberFormatter } from "../common";
import { Token } from "./Main";
import { TokenRowCollapse } from "./TokenRowCollapse";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VerifiedIcon from "@mui/icons-material/Verified";

export const TokenRow = (props: {
  tokenIndex: number;
  tokens: Token[];
  tokensAreUpdated: boolean;
}) => {
  const { tokenIndex, tokens, tokensAreUpdated } = props;
  const {
    chainId,
    account: walletAddress,
    isAuthenticated: walletIsConnected,
    authenticate: connectWallet,
    logout: disconnectWallet,
  } = useMoralis();

  // tokens[tokenIndex].price = useTokensPrices([
  //   getContractAddress(
  //     tokens[tokenIndex].name.toLowerCase() + "_token",
  //     "bsc-main"
  //   ),
  // ])[0];
  // tokens[tokenIndex].stakerData.walletBalance = parseFloat(
  //   formatEther(useTokenBalance(tokens[tokenIndex].address, walletAddress) ?? 0)
  // );

  const token = tokens[tokenIndex];
  const rewardToken = tokens.filter(
    (tokenx) => tokenx.address === token.rewardToken
  )[0];

  const [open, setOpen] = useState(false);
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          verticalAlign: "top",
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell width={1}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box visibility={token.isVerified ? "visible" : "hidden"}>
              <VerifiedIcon color="success" />
            </Box>
            {token.category === 0 ? (
              <Avatar alt={token.name + " Icon"} src={token.icon[0]} />
            ) : (
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  <SmallAvatar alt={token.name + " Icon"} src={token.icon[1]} />
                }
              >
                <Avatar alt={token.name + " Icon"} src={token.icon[0]} />
              </Badge>
            )}
            <Box>
              <Typography variant="button" fontSize={{ sm: "1.1rem" }}>
                Stake {token.name}
              </Typography>
              <Typography
                display={{ xs: "none", sm: "block" }}
                variant="caption"
              >
                Earn {rewardToken?.name}
                {token.hasMultiTokenRewards ? " & more." : "."}
              </Typography>
            </Box>
          </Stack>
          <Typography
            display={{ xs: "block", sm: "none" }}
            variant="caption"
            align="justify"
            ml={4}
          >
            Earn {rewardToken?.name}
            {token.hasMultiTokenRewards ? " & more." : "."}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">APR</Typography>
          <Typography>{token.stakingApr}%</Typography>
        </TableCell>
        <TableCell>
          <Box
            display={{ xs: walletIsConnected ? "block" : "none", sm: "block" }}
          >
            <Typography variant="subtitle2" noWrap>
              You Staked
            </Typography>
            <Typography noWrap>
              {numberFormatter.format(token.stakerData.stakingBalance)}{" "}
              {token.name}
            </Typography>
            <Typography variant="body2" noWrap>
              {numberFormatter.format(
                token.price * token.stakerData.stakingBalance
              )}{" "}
              USD
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box
            display={{ xs: walletIsConnected ? "block" : "none", sm: "block" }}
          >
            <Typography variant="subtitle2" noWrap>
              Your Reward Balance
            </Typography>
            <Typography noWrap>
              {numberFormatter.format(
                rewardToken?.stakerData.rewardBalance ?? 0
              )}{" "}
              {rewardToken?.name}
            </Typography>
            <Typography variant="body2" noWrap>
              {numberFormatter.format(
                (rewardToken?.price ?? 0) *
                  (rewardToken?.stakerData.rewardBalance ?? 0)
              )}{" "}
              USD
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box
            display={{ xs: walletIsConnected ? "none" : "block", sm: "block" }}
          >
            <Typography variant="subtitle2" noWrap>
              Total Staked
            </Typography>
            <Typography noWrap>
              {numberFormatter.format(token.stakingBalance)} {token.name}
            </Typography>
            <Typography variant="body2" noWrap>
              {numberFormatter.format(token.price * token.stakingBalance)} USD
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box
            display={{ xs: walletIsConnected ? "none" : "block", sm: "block" }}
          >
            <Typography variant="subtitle2" noWrap>
              Reward Balance
            </Typography>
            <Typography noWrap>
              {numberFormatter.format(rewardToken?.rewardBalance ?? 0)}{" "}
              {rewardToken?.name}
            </Typography>
            <Typography variant="body2" noWrap>
              {numberFormatter.format(
                (rewardToken?.price ?? 0) * (rewardToken?.rewardBalance ?? 0)
              )}{" "}
              USD
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TokenRowCollapse
              tokenIndex={tokenIndex}
              tokens={tokens}
              tokensAreUpdated={tokensAreUpdated}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
