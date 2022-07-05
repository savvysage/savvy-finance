import { ethers } from "ethers";
import {
  Fetcher,
  Route,
  TokenAmount,
  Trade,
  TradeType,
} from "@pancakeswap/sdk";
import brownieConfig from "./brownie-config.json";
import helperConfig from "./helper-config.json";

export const defaultChainId = helperConfig.defaultChainId;
export const chain = (chainId: number): string =>
  helperConfig.networks[chainId].name[0];
export const chainJsonRpcUrl = (chainId: number): string =>
  helperConfig.networks[chainId].jsonRpcUrl;
export const chainStableTokenAddress = (chainId: number): string =>
  helperConfig.networks[chainId].stableTokenAddress;
export const chainProvider = (chainId: number) =>
  new ethers.providers.JsonRpcProvider(chainJsonRpcUrl(chainId));
// console.log(
//   defaultChainId,
//   chain(defaultChainId),
//   chainJsonRpcUrl(defaultChainId),
//   chainStableTokenAddress(defaultChainId),
//   chainProvider(defaultChainId)
// );

export const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const shortenAddress = (address: string) => {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
};

export const numberFormatter = Intl.NumberFormat("en", {
  notation: "compact",
  // maximumFractionDigits: 2,
});

export const secondsToYears = (seconds: number): number => {
  return seconds * 0.0000000317098;
};

export const calculateStakingReward = (
  stakingApr: number,
  stakingValue: number,
  stakingTimestampLastRewarded: number
): number => {
  const stakingRewardRate = stakingApr / 100;
  const stakingTimestampStarted = stakingTimestampLastRewarded;
  const stakingTimestampEnded = Math.ceil(+new Date() / 1000);
  const stakingDurationInSeconds =
    stakingTimestampEnded - stakingTimestampStarted;
  const stakingDurationInYears = secondsToYears(stakingDurationInSeconds);
  const stakingRewardValue =
    stakingValue * stakingRewardRate * stakingDurationInYears;
  return stakingRewardValue;
};

export const getContractAddress = (
  contractName: string,
  networkName: string = chain(defaultChainId)
): string | undefined => {
  return brownieConfig["networks"][networkName]["contracts"][contractName];
};

export const getContractName = (
  contractAddress: string,
  networkName: string = chain(defaultChainId)
): string | undefined => {
  var contractName: string | undefined;

  const networkContracts = brownieConfig["networks"][networkName]["contracts"];
  Object.entries(networkContracts).forEach(
    ([contractNamex, contractAddressx]) => {
      if (contractAddressx === contractAddress) contractName = contractNamex;
    }
  );

  return contractName;
};

export const getTokenPrice = (
  tokenAddress: string,
  chainId: number = defaultChainId
) => {
  (async () => {
    const provider = chainProvider(chainId);
    const stableTokenAddress = chainStableTokenAddress(chainId);

    const token = await Fetcher.fetchTokenData(chainId, tokenAddress, provider);
    const stableToken = await Fetcher.fetchTokenData(
      chainId,
      stableTokenAddress,
      provider
    );
    const pair = await Fetcher.fetchPairData(token, stableToken, provider);
    const route = new Route([pair], token);
    const price = route.midPrice.toSignificant(token.decimals);
    console.log("price", price);

    const trade = new Trade(
      route,
      new TokenAmount(token, 1 * 10 ** 15),
      TradeType.EXACT_INPUT
    );
    console.log(
      "exec_price",
      trade.executionPrice.toSignificant(token.decimals)
    );
    console.log(
      "next_mid_price",
      trade.nextMidPrice.toSignificant(token.decimals)
    );
  })();
};
// getTokenPrice("0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd");
// getTokenPrice("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", 56);
