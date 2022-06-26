// import {
//   ERC20Interface,
//   useCall,
//   useCalls,
//   useContractFunction,
//   useEthers,
// } from "@usedapp/core";
import { constants, Contract, utils } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
// import { networks } from "../helper-config.json"
import contractAddresses from "../back_end_build/deployments/map.json";
import SavvyFinanceFarm from "../back_end_build/contracts/SavvyFinanceFarm.json";
import { Token } from "../components/Main";

// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export type TokenData = {
  address: string;
  isActive: boolean;
  isVerified: boolean;
  hasMultiTokenRewards: boolean;
  name: string;
  category: number;
  price: number;
  rewardBalance: number;
  stakingBalance: number;
  stakingApr: number;
  rewardToken: string;
  admin: string;
  devDepositFee: number;
  devWithdrawFee: number;
  devStakeFee: number;
  devUnstakeFee: number;
  adminStakeFee: number;
  adminUnstakeFee: number;
  timestampAdded: number;
  timestampLastUpdated: number;
};

export type TokenStakerData = {
  walletBalance: number;
  rewardBalance: number;
  stakingBalance: number;
  stakingRewardToken: string;
  stakingRewards: {
    id: number;
    staker: string;
    rewardToken: string;
    rewardTokenPrice: number;
    rewardTokenAmount: number;
    stakedToken: string;
    stakedTokenPrice: number;
    stakedTokenAmount: number;
    stakingApr: number;
    stakingDurationInSeconds: number;
    triggeredBy: string[2];
    timestampAdded: number;
    timestampLastUpdated: number;
  }[];
  timestampLastRewarded: number;
  timestampAdded: number;
  timestampLastUpdated: number;
};

export const getTokenByAddress = (
  tokenAddress: string,
  tokens: Token[]
): Token | undefined => {
  var token: Token | undefined;
  tokens.forEach((tokenx) => {
    if (tokenx.address === tokenAddress) token = tokenx;
  });
  return token;
};

// export const useContract = (): Contract => {
//   const { chainId } = useEthers();

//   // const networkName = chainId ? networks[String(chainId)] : "bsc-test"
//   const svfFarmAddress = chainId
//     ? contractAddresses[String(chainId)]["TransparentUpgradeableProxy"][0]
//     : constants.AddressZero;
//   const svfFarmInterface = new utils.Interface(SavvyFinanceFarm.abi);

//   return new Contract(svfFarmAddress, svfFarmInterface);
// };

// export const useTokenContract = (tokenAddress: string): Contract => {
//   return new Contract(tokenAddress, ERC20Interface);
// };

export const useTokens = (): string[] => {
  var tokens: string[] = [];

  // const contract = useContract();
  // const { value, error } =
  //   useCall({
  //     contract: contract,
  //     method: "getTokens",
  //     args: [],
  //   }) ?? {};

  // if (value) tokens = value[0];
  // if (error) console.error(error.message);

  return tokens;
};

export const useTokensData = (tokensAddresses: string[]): TokenData[] | [] => {
  var tokensData: TokenData[] | [] = [];

  // const contract = useContract();
  // const calls =
  //   tokensAddresses.map((tokenAddress) => ({
  //     contract: contract,
  //     method: "getTokenData",
  //     args: [tokenAddress],
  //   })) ?? [];
  // const results = useCalls(calls) ?? [];

  // results.forEach((result, index) => {
  //   if (result?.value) {
  //     // console.log(result.value[0]);
  //     const address = calls[index]["args"][0];
  //     const isActive = result.value[0]["isActive"];
  //     const isVerified = result.value[0]["isVerified"];
  //     const hasMultiTokenRewards = result.value[0]["hasMultiTokenRewards"];
  //     const name = result.value[0]["name"];
  //     const category = parseInt(result.value[0]["category"]);
  //     const price = parseFloat(formatEther(result.value[0]["price"]));
  //     const rewardBalance = parseFloat(
  //       formatEther(result.value[0]["rewardBalance"])
  //     );
  //     const stakingBalance = parseFloat(
  //       formatEther(result.value[0]["stakingBalance"])
  //     );
  //     const stakingApr = parseFloat(formatEther(result.value[0]["stakingApr"]));
  //     const rewardToken = result.value[0]["rewardToken"];
  //     const admin = result.value[0]["admin"];
  //     const devDepositFee = parseFloat(
  //       formatEther(result.value[0]["fees"]["devDepositFee"])
  //     );
  //     const devWithdrawFee = parseFloat(
  //       formatEther(result.value[0]["fees"]["devWithdrawFee"])
  //     );
  //     const devStakeFee = parseFloat(
  //       formatEther(result.value[0]["fees"]["devStakeFee"])
  //     );
  //     const devUnstakeFee = parseFloat(
  //       formatEther(result.value[0]["fees"]["devUnstakeFee"])
  //     );
  //     const adminStakeFee = parseFloat(
  //       formatEther(result.value[0]["fees"]["adminStakeFee"])
  //     );
  //     const adminUnstakeFee = parseFloat(
  //       formatEther(result.value[0]["fees"]["adminUnstakeFee"])
  //     );
  //     const timestampAdded = parseInt(result.value[0]["timestampAdded"]);
  //     const timestampLastUpdated = parseInt(
  //       result.value[0]["timestampLastUpdated"]
  //     );
  //     tokensData[index] = {
  //       address: address,
  //       isActive: isActive,
  //       isVerified: isVerified,
  //       hasMultiTokenRewards: hasMultiTokenRewards,
  //       name: name,
  //       category: category,
  //       price: price,
  //       rewardBalance: rewardBalance,
  //       stakingBalance: stakingBalance,
  //       stakingApr: stakingApr,
  //       rewardToken: rewardToken,
  //       admin: admin,
  //       devDepositFee: devDepositFee,
  //       devWithdrawFee: devWithdrawFee,
  //       devStakeFee: devStakeFee,
  //       devUnstakeFee: devUnstakeFee,
  //       adminStakeFee: adminStakeFee,
  //       adminUnstakeFee: adminUnstakeFee,
  //       timestampAdded: timestampAdded,
  //       timestampLastUpdated: timestampLastUpdated,
  //     };
  //   }
  //   if (result?.error)
  //     console.error(tokensAddresses[index], result.error.message);
  // });

  return tokensData;
};

export const useTokensStakerData = (
  tokensAddresses: string[],
  stakerAddress: string
): TokenStakerData[] | [] => {
  var tokensStakerData: TokenStakerData[] | [] = [];

  // const contract = useContract();
  // const calls =
  //   tokensAddresses.map((tokenAddress) => ({
  //     contract: contract,
  //     method: "getTokenStakerData",
  //     args: [tokenAddress, stakerAddress],
  //   })) ?? [];
  // const results = useCalls(calls) ?? [];

  // results.forEach((result, index) => {
  //   if (result?.value) {
  //     // console.log(result.value[0]);
  //     const walletBalance = 0;
  //     const rewardBalance = parseFloat(
  //       formatEther(result.value[0]["rewardBalance"])
  //     );
  //     const stakingBalance = parseFloat(
  //       formatEther(result.value[0]["stakingBalance"])
  //     );
  //     const stakingRewardToken = result.value[0]["stakingRewardToken"];
  //     const stakingRewards = result.value[0]["stakingRewards"].map(
  //       (stakingReward: {}) => {
  //         // console.log(stakingReward);
  //         return {
  //           id: parseInt(stakingReward["id"]),
  //           staker: stakingReward["staker"],
  //           rewardToken: stakingReward["rewardToken"],
  //           rewardTokenPrice: parseFloat(
  //             formatEther(stakingReward["rewardTokenPrice"])
  //           ),
  //           rewardTokenAmount: parseFloat(
  //             formatEther(stakingReward["rewardTokenAmount"])
  //           ),
  //           stakedToken: stakingReward["stakedToken"],
  //           stakedTokenPrice: parseFloat(
  //             formatEther(stakingReward["stakedTokenPrice"])
  //           ),
  //           stakedTokenAmount: parseFloat(
  //             formatEther(stakingReward["stakedTokenAmount"])
  //           ),
  //           stakingApr: parseFloat(formatEther(stakingReward["stakingApr"])),
  //           stakingDurationInSeconds: parseInt(
  //             formatEther(stakingReward["stakingDurationInSeconds"])
  //           ),
  //           triggeredBy: [
  //             stakingReward["triggeredBy"][0],
  //             stakingReward["triggeredBy"][1],
  //           ],
  //           timestampAdded: parseInt(stakingReward["timestampAdded"]),
  //           timestampLastUpdated: parseInt(
  //             stakingReward["timestampLastUpdated"]
  //           ),
  //         };
  //       }
  //     );
  //     const timestampLastRewarded = parseInt(
  //       result.value[0]["timestampLastRewarded"]
  //     );
  //     const timestampAdded = parseInt(result.value[0]["timestampAdded"]);
  //     const timestampLastUpdated = parseInt(
  //       result.value[0]["timestampLastUpdated"]
  //     );
  //     tokensStakerData[index] = {
  //       walletBalance: walletBalance,
  //       rewardBalance: rewardBalance,
  //       stakingBalance: stakingBalance,
  //       stakingRewardToken: stakingRewardToken,
  //       stakingRewards: stakingRewards,
  //       timestampLastRewarded: timestampLastRewarded,
  //       timestampAdded: timestampAdded,
  //       timestampLastUpdated: timestampLastUpdated,
  //     };
  //   }
  //   if (result?.error)
  //     console.error(tokensAddresses[index], result.error.message);
  // });

  return tokensStakerData;
};

export const useTokensPrices = (tokensAddresses: string[]): number[] => {
  const [tokensPrices, setTokensPrices] = useState<number[]>([]);

  tokensAddresses.forEach((tokenAddress, index) => {
    if (tokenAddress !== undefined)
      (async () => {
        try {
          const response = await axios.get(
            `https://api.pancakeswap.info/api/v2/tokens/${tokenAddress}`
          );
          if (response.data.data.price)
            setTokensPrices((tokensPrices) => {
              tokensPrices[index] = response.data.data.price;
              return tokensPrices;
            });
        } catch (error) {
          console.error(error);
        }
      })();
  });

  return tokensPrices;
};

export const useStakeToken = (tokenAddress: string) => {
  // const contract = useContract();
  // const tokenContract = useTokenContract(tokenAddress);
  // const { state: approveTokenState, send: approveTokenSend } =
  //   useContractFunction(tokenContract, "approve", {
  //     transactionName: "Approve Token",
  //   });
  // const { state: stakeTokenState, send: stakeTokenSend } = useContractFunction(
  //   contract,
  //   "stakeToken",
  //   {
  //     transactionName: "Stake Token",
  //   }
  // );
  // const [tokenAmount, setTokenAmount] = useState("0");
  // const approveAndStakeToken = (tokenAmount: string) => {
  //   setTokenAmount(tokenAmount);
  //   return approveTokenSend(contract.address, parseEther(tokenAmount));
  // };
  // useEffect(() => {
  //   if (approveTokenState.status === "Success")
  //     stakeTokenSend(tokenAddress, parseEther(tokenAmount));
  // }, [approveTokenState]);
  // return { approveAndStakeToken, approveTokenState, stakeTokenState };
};

export const useUnstakeToken = (tokenAddress: string) => {
  // const contract = useContract();
  // const { state: unstakeTokenState, send: unstakeTokenSend } =
  //   useContractFunction(contract, "unstakeToken", {
  //     transactionName: "Unstake Token",
  //   });
  // const unstakeToken = (tokenAmount: string) =>
  //   unstakeTokenSend(tokenAddress, parseEther(tokenAmount));
  // return { unstakeToken, unstakeTokenState };
};

export const useWithdrawRewardToken = (tokenAddress: string) => {
  // const contract = useContract();
  // const { state: withdrawRewardTokenState, send: withdrawRewardTokenSend } =
  //   useContractFunction(contract, "withdrawStakingReward", {
  //     transactionName: "Withdraw Reward Token",
  //   });
  // const withdrawRewardToken = (tokenAmount: string) =>
  //   withdrawRewardTokenSend(tokenAddress, parseEther(tokenAmount));
  // return { withdrawRewardToken, withdrawRewardTokenState };
};

export const useChangeStakingRewardToken = (tokenAddress: string) => {
  // const contract = useContract();
  // const {
  //   state: changeStakingRewardTokenState,
  //   send: changeStakingRewardTokenSend,
  // } = useContractFunction(contract, "setStakingRewardToken", {
  //   transactionName: "Change Reward Token",
  // });
  // const changeStakingRewardToken = (rewardTokenAddress: string) =>
  //   changeStakingRewardTokenSend(tokenAddress, rewardTokenAddress);
  // return { changeStakingRewardToken, changeStakingRewardTokenState };
};
