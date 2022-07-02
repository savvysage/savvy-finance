import brownieConfig from "./brownie-config.json";
import helperConfig from "./helper-config.json";

export const defaultChainId = helperConfig.defaultChainId;
export const defaultChain = helperConfig.networks[defaultChainId][0];
// console.log(defaultChainId, defaultChain);

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
  networkName: string = defaultChain
): string | undefined => {
  return brownieConfig["networks"][networkName]["contracts"][contractName];
};

export const getContractName = (
  contractAddress: string,
  networkName: string = defaultChain
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
