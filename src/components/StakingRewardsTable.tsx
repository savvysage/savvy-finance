import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useMoralis } from "react-moralis";
import { numberFormatter } from "../common";
import { Token } from "./Main";

export const StakingRewardsTable = (props: {
  token: Token;
  tokens: Token[];
}) => {
  const { token, tokens } = props;
  const rewardToken = tokens.filter(
    (tokenx) => tokenx.address === token.rewardToken
  )[0];

  const {
    chainId,
    account: walletAddress,
    isAuthenticated: walletIsConnected,
    authenticate: connectWallet,
    logout: disconnectWallet,
  } = useMoralis();

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "25rem" }}>
      <Table size="small" aria-label="staking rewards table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Reward Value</TableCell>
            <TableCell>Staking Value</TableCell>
            <TableCell>Staking APR</TableCell>
            <TableCell>Staking Duration</TableCell>
            <TableCell>Triggered By</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {token.stakerData.stakingRewards
            .slice()
            .reverse()
            .map((stakingReward) => (
              <TableRow
                key={stakingReward.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography noWrap>{stakingReward.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>
                    {numberFormatter.format(stakingReward.rewardTokenAmount)}{" "}
                    {token.name}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {numberFormatter.format(
                      stakingReward.rewardTokenPrice *
                        stakingReward.rewardTokenAmount
                    )}{" "}
                    USD
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>
                    {numberFormatter.format(stakingReward.stakedTokenAmount)}{" "}
                    {token.name}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {numberFormatter.format(
                      stakingReward.stakedTokenPrice *
                        stakingReward.stakedTokenAmount
                    )}{" "}
                    USD
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>{stakingReward.stakingApr}%</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>
                    {numberFormatter.format(
                      stakingReward.stakingDurationInSeconds
                    )}{" "}
                    secs
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>
                    {stakingReward.triggeredBy[0]}{" "}
                    {stakingReward.triggeredBy[1]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>
                    {moment(
                      new Date(stakingReward.timestampAdded * 1000)
                    ).fromNow()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
