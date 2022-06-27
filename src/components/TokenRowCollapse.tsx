import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { calculateStakingReward, numberFormatter } from "../common";
import {
  useChangeStakingRewardToken,
  useStakeToken,
  useUnstakeToken,
  useWithdrawRewardToken,
} from "../hooks/farm";
import { Token } from "./Main";
import { StakingRewardsTable } from "./StakingRewardsTable";
import { ConnectWallet } from "./Wallet/ConnectWallet";
import helperConfig from "../helper-config.json";

const zeroAddress = helperConfig.zeroAddress;

function Actions(props: {
  tokenIndex: number;
  tokens: Token[];
  tokensAreUpdated: boolean;
}) {
  const { tokenIndex, tokens, tokensAreUpdated } = props;
  const token = tokens[tokenIndex];
  token.devStakeFee = token.devStakeFee !== 1e-18 ? token.devStakeFee : 1;
  token.devUnstakeFee = token.devUnstakeFee !== 1e-18 ? token.devUnstakeFee : 1;
  token.adminStakeFee = token.adminStakeFee !== 1e-18 ? token.adminStakeFee : 1;
  token.adminUnstakeFee =
    token.adminUnstakeFee !== 1e-18 ? token.adminUnstakeFee : 1;

  const {
    chainId,
    account: walletAddress,
    isAuthenticated: walletIsConnected,
    authenticate: connectWallet,
    logout: disconnectWallet,
  } = useMoralis();

  // const { notifications } = useNotifications();
  // const [notify, setNotify] = React.useState("");
  // useEffect(() => {
  //   if (
  //     notifications.filter(
  //       (notification) =>
  //         notification.type === "transactionSucceed" &&
  //         notification.transactionName === "Approve Token"
  //     ).length > 0
  //   )
  //     setNotify(`Approved ${tabAmount} ${token.name} tokens.`);

  //   if (
  //     notifications.filter(
  //       (notification) =>
  //         notification.type === "transactionSucceed" &&
  //         notification.transactionName === "Stake Token"
  //     ).length > 0
  //   )
  //     setNotify(`Staked ${tabAmount} ${token.name} tokens.`);

  //   if (
  //     notifications.filter(
  //       (notification) =>
  //         notification.type === "transactionSucceed" &&
  //         notification.transactionName === "Unstake Token"
  //     ).length > 0
  //   )
  //     setNotify(`Unstaked ${tabAmount} ${token.name} tokens.`);

  //   if (
  //     notifications.filter(
  //       (notification) =>
  //         notification.type === "transactionSucceed" &&
  //         notification.transactionName === "Withdraw Reward Token"
  //     ).length > 0
  //   )
  //     setNotify(`Withdrew ${tabAmount} ${token.name} reward tokens.`);

  //   if (
  //     notifications.filter(
  //       (notification) =>
  //         notification.type === "transactionSucceed" &&
  //         notification.transactionName === "Change Reward Token"
  //     ).length > 0
  //   )
  //     setNotify(`Changed ${token.name} staking reward token.`);
  // }, [notifications]);

  // const { approveAndStakeToken, approveTokenState, stakeTokenState } =
  //   useStakeToken(token.address);
  // const { unstakeToken, unstakeTokenState } = useUnstakeToken(token.address);
  // const { withdrawRewardToken, withdrawRewardTokenState } =
  //   useWithdrawRewardToken(token.address);
  // const { changeStakingRewardToken, changeStakingRewardTokenState } =
  //   useChangeStakingRewardToken(token.address);

  // const tabOptionIsMining =
  //   approveTokenState.status === "Mining" ||
  //   stakeTokenState.status === "Mining" ||
  //   unstakeTokenState.status === "Mining" ||
  //   withdrawRewardTokenState.status === "Mining";
  const [tabOption, setTabOption] = useState("stake");
  const handleChangeTabOption = (
    event: React.SyntheticEvent,
    newOption: string
  ) => {
    setTabOption(newOption);
  };

  const [tabAmount, setTabAmount] = useState("");
  const handleChangeTabAmount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTabAmount(event.target.value);
  };
  const handleMaxTabAmount = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (tabOption === "stake")
      setTabAmount(token.stakerData.walletBalance.toString());
    if (tabOption === "unstake")
      setTabAmount(token.stakerData.stakingBalance.toString());
    if (tabOption === "withdraw reward")
      setTabAmount(token.stakerData.rewardBalance.toString());
  };
  const handleClickTabButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    // if (tabOption === "stake") approveAndStakeToken(tabAmount);
    // if (tabOption === "unstake") unstakeToken(tabAmount);
    // if (tabOption === "withdraw reward") withdrawRewardToken(tabAmount);
  };

  // const stakingRewardTokenIsMining =
  //   changeStakingRewardTokenState.status === "Mining";
  const [stakingRewardToken, setStakingRewardToken] = useState(
    token.stakerData.stakingRewardToken !== zeroAddress
      ? token.stakerData.stakingRewardToken
      : token.rewardToken
  );
  const handleChangeStakingRewardToken = (event: SelectChangeEvent) => {
    const rewardTokenAddress = event.target.value;
    setStakingRewardToken(rewardTokenAddress);

    // if (walletIsConnected) changeStakingRewardToken(rewardTokenAddress);
  };
  useEffect(() => {
    if (tokensAreUpdated)
      setStakingRewardToken(
        token.stakerData.stakingRewardToken !== zeroAddress
          ? token.stakerData.stakingRewardToken
          : token.rewardToken
      );
  }, [tokensAreUpdated]);

  return (
    <Stack spacing={2.5}>
      <Box component={Paper}>
        <Box px={2.5} py={1.5} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="button">Change Reward Token</Typography>
        </Box>
        <Box p={2.5}>
          <FormControl fullWidth>
            <InputLabel>Reward Token</InputLabel>
            <Select
              label="Reward Token"
              // disabled={stakingRewardTokenIsMining}
              value={stakingRewardToken}
              onChange={handleChangeStakingRewardToken}
            >
              {token.hasMultiTokenRewards === true ? (
                tokens.map((token) =>
                  token.hasMultiTokenRewards === true ? (
                    <MenuItem key={token.name} value={token.address}>
                      {token.name}
                      {/* {stakingRewardTokenIsMining ? (
                        <CircularProgress size={15} />
                      ) : (
                        token.name
                      )} */}
                    </MenuItem>
                  ) : null
                )
              ) : (
                <MenuItem value={token.address}>{token.name}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box component={Paper}>
        <TabContext value={tabOption}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChangeTabOption}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Stake" value="stake" />
              <Tab label="Unstake" value="unstake" />
              <Tab label="Withdraw Reward" value="withdraw reward" />
            </TabList>
          </Box>
          <TabPanel value={tabOption}>
            <Typography variant="body2">
              Stake Fee: {token.devStakeFee + token.adminStakeFee}%
            </Typography>
            <Typography variant="body2">
              Unstake Fee: {token.devUnstakeFee + token.adminUnstakeFee}%
            </Typography>
            <TextField
              label="Amount"
              type="number"
              margin="normal"
              value={tabAmount}
              onChange={handleChangeTabAmount}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleMaxTabAmount}>MAX</Button>
                  </InputAdornment>
                ),
              }}
            />
            <br />
            {!walletIsConnected ? (
              <ConnectWallet />
            ) : (
              <Button
                variant="contained"
                size="large"
                color="secondary"
                // disabled={tabOptionIsMining}
                onClick={handleClickTabButton}
              >
                {tabOption}
                {/* {tabOptionIsMining ? <CircularProgress size={25} /> : tabOption} */}
              </Button>
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}

export const TokenRowCollapse = (props: {
  tokenIndex: number;
  tokens: Token[];
  tokensAreUpdated: boolean;
}) => {
  const { tokenIndex, tokens, tokensAreUpdated } = props;
  const token = tokens[tokenIndex];
  const rewardToken = tokens.filter(
    (tokenx) => tokenx.address === token.rewardToken
  )[0];

  // const {
  //   chainId,
  //   account: walletAddress,
  //   isAuthenticated: walletIsConnected,
  //   authenticate: connectWallet,
  //   logout: disconnectWallet,
  // } = useMoralis();

  const stakingRewardValue = calculateStakingReward(
    token.stakingApr,
    token.price * token.stakerData.stakingBalance,
    token.stakerData.timestampLastRewarded !== 0
      ? token.stakerData.timestampLastRewarded
      : token.stakerData.timestampAdded
  );
  const rewardTokenAmount = stakingRewardValue / (rewardToken?.price ?? 0);

  return (
    <Box sx={{ my: 2.5, mx: { xs: 10, sm: 5 } }}>
      <Table size="small" aria-label="token row collapse">
        <TableBody>
          <TableRow sx={{ textAlign: "center", verticalAlign: "top" }}>
            <TableCell sx={{ maxWidth: "10rem" }}>
              <Stack spacing={2.5}>
                <Box component={Paper}>
                  <Box
                    px={2.5}
                    py={1.5}
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    <Typography variant="button">Your Balances</Typography>
                  </Box>
                  <Box p={2.5}>
                    <Typography variant="body2">
                      Wallet Balance:{" "}
                      {token.stakerData.walletBalance.toLocaleString("en-us")}{" "}
                      {token.name}
                    </Typography>
                    <Typography variant="body2">
                      Staking Balance:{" "}
                      {token.stakerData.stakingBalance.toLocaleString("en-us")}{" "}
                      {token.name}
                    </Typography>
                    <Typography variant="body2">
                      Reward Balance:{" "}
                      {rewardToken?.stakerData.rewardBalance.toLocaleString(
                        "en-us"
                      )}{" "}
                      {rewardToken?.name}
                    </Typography>
                  </Box>
                </Box>
                <Box component={Paper}>
                  <Box
                    px={2.5}
                    py={1.5}
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    <Typography variant="button">
                      Your Staking Rewards History
                    </Typography>
                  </Box>
                  <Box p={2.5}>
                    <Box my={1}>
                      <Typography>
                        Pending Reward:{" "}
                        {numberFormatter.format(rewardTokenAmount)}{" "}
                        {rewardToken?.name} (
                        <Typography variant="body2" component="span">
                          {numberFormatter.format(stakingRewardValue)} USD
                        </Typography>
                        ){" "}
                        <Button
                          size="small"
                          color="secondary"
                          // onClick={handleClickTabButton}
                        >
                          Claim
                        </Button>
                      </Typography>
                    </Box>
                    <StakingRewardsTable token={token} tokens={tokens} />
                  </Box>
                </Box>
                <Box display={{ xs: "block", sm: "none" }}>
                  <Actions
                    tokenIndex={tokenIndex}
                    tokens={tokens}
                    tokensAreUpdated={tokensAreUpdated}
                  />
                </Box>
              </Stack>
            </TableCell>
            <TableCell
              sx={{
                maxWidth: "10rem",
                display: { xs: "none", sm: "table-cell" },
              }}
            >
              <Actions
                tokenIndex={tokenIndex}
                tokens={tokens}
                tokensAreUpdated={tokensAreUpdated}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
