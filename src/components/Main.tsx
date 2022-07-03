import { useMoralis } from "react-moralis";
import { Stack } from "@mui/material";
import { TokensTable } from "./TokensTable";
import {
  TokenData,
  TokenStakerData,
  useTokens,
  useTokensData,
  useTokensStakerData,
} from "../hooks/farm";
import tokensJSON from "../tokens.json";
import helperConfig from "../helper-config.json";

const zeroAddress = helperConfig.zeroAddress;

export type Token = TokenData & {
  icon: string[];
  stakerData: TokenStakerData;
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

  const tokenAddresses = useTokens();
  const tokensData: { [tokenAddress: string]: TokenData } =
    useTokensData(tokenAddresses);
  const tokensStakerData: { [tokenAddress: string]: TokenStakerData } =
    useTokensStakerData(tokenAddresses, walletAddress ?? zeroAddress);
  // console.log(
  //   tokenAddresses.length,
  //   Object.keys(tokensData).length,
  //   Object.keys(tokensStakerData).length
  // );

  if (tokenAddresses.length > 0)
    if (
      tokenAddresses.length === Object.keys(tokensData).length &&
      tokenAddresses.length === Object.keys(tokensStakerData).length
    ) {
      tokenAddresses.forEach((tokenAddress, index) => {
        tokens[index] = {
          ...tokensData[tokenAddress],
          icon:
            tokensData[tokenAddress].category === 0
              ? [
                  `${process.env.PUBLIC_URL}/icons/${tokensData[
                    tokenAddress
                  ].name.toLowerCase()}.png`,
                ]
              : [
                  `${process.env.PUBLIC_URL}/icons/${tokensData[
                    tokenAddress
                  ].name
                    .split("-")[0]
                    .toLowerCase()}.png`,
                  `${process.env.PUBLIC_URL}/icons/${tokensData[
                    tokenAddress
                  ].name
                    .split("-")[1]
                    .toLowerCase()}.png`,
                ],
          stakerData: tokensStakerData[tokenAddress],
        };
      });
      tokensAreUpdated = true;
      localStorage.setItem("tokens", JSON.stringify(tokens));
    }
  // console.log(tokens);

  return (
    <Stack spacing={2}>
      <TokensTable tokens={tokens} tokensAreUpdated={tokensAreUpdated} />
    </Stack>
  );
};
