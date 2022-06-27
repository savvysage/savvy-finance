import { constants } from "ethers";
import { Stack } from "@mui/material";
import { TokensTable } from "./TokensTable";
import * as svfFarm from "../hooks/farm";
import { getContractAddress } from "../common";
import tokensJSON from "../tokens.json";
import { useMoralis } from "react-moralis";

export type Token = svfFarm.TokenData & {
  icon: string[];
  stakerData: svfFarm.TokenStakerData;
};

export const Main = () => {
  var tokens: Token[] = tokensJSON;
  var tokensAreUpdated = false;

  // localStorage.removeItem("tokens");
  if (!localStorage.getItem("tokens"))
    localStorage.setItem("tokens", JSON.stringify(tokens));
  else
    try {
      tokens = JSON.parse(localStorage.getItem("tokens") ?? "[]");
    } catch (error) {
      console.error(error);
    }

  const {
    chainId,
    account: walletAddress,
    isAuthenticated: walletIsConnected,
    authenticate: connectWallet,
    logout: disconnectWallet,
  } = useMoralis();

  const tokensAddresses: string[] = svfFarm.useTokens();
  const tokensData: svfFarm.TokenData[] =
    svfFarm.useTokensData(tokensAddresses);
  const tokensStakerData: svfFarm.TokenStakerData[] =
    svfFarm.useTokensStakerData(
      tokensAddresses,
      walletAddress ?? constants.AddressZero
    );

  if (tokensAddresses.length !== 0)
    if (
      tokensData.length === tokensAddresses.length &&
      tokensStakerData.length === tokensData.length
    ) {
      tokensAddresses.forEach((tokenAddress, index) => {
        tokens[index] = {
          address: tokensData[index].address,
          isActive: tokensData[index].isActive,
          isVerified: tokensData[index].isVerified,
          hasMultiTokenRewards: tokensData[index].hasMultiTokenRewards,
          name: tokensData[index].name,
          category: tokensData[index].category,
          price: tokensData[index].price,
          rewardBalance: tokensData[index].rewardBalance,
          stakingBalance: tokensData[index].stakingBalance,
          stakingApr: tokensData[index].stakingApr,
          rewardToken: tokensData[index].rewardToken,
          admin: tokensData[index].admin,
          devDepositFee: tokensData[index].devDepositFee,
          devWithdrawFee: tokensData[index].devWithdrawFee,
          devStakeFee: tokensData[index].devStakeFee,
          devUnstakeFee: tokensData[index].devUnstakeFee,
          adminStakeFee: tokensData[index].adminStakeFee,
          adminUnstakeFee: tokensData[index].adminUnstakeFee,
          timestampAdded: tokensData[index].timestampAdded,
          timestampLastUpdated: tokensData[index].timestampLastUpdated,
          icon:
            tokensData[index].category === 0
              ? [
                  process.env.PUBLIC_URL +
                    `/icons/${tokensData[index].name.toLowerCase()}.png`,
                ]
              : [
                  process.env.PUBLIC_URL +
                    `/icons/${tokensData[index].name
                      .split("-")[0]
                      .toLowerCase()}.png`,
                  process.env.PUBLIC_URL +
                    `/icons/${tokensData[index].name
                      .split("-")[1]
                      .toLowerCase()}.png`,
                ],
          stakerData: tokensStakerData[index],
        };
      });
      tokensAreUpdated = true;
      localStorage.setItem("tokens", JSON.stringify(tokens));
    }

  return (
    <Stack spacing={2}>
      <TokensTable tokens={tokens} tokensAreUpdated={tokensAreUpdated} />
    </Stack>
  );
};
