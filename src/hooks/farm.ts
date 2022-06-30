import { useCallback, useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import axios from "axios";
import SavvyFinanceFarm from "../back_end_build/contracts/SavvyFinanceFarm.json";
import deploymentsMap from "../back_end_build/deployments/map.json";
import helperConfig from "../helper-config.json";

export const farmAbi = SavvyFinanceFarm.abi;
export const farmChainId = helperConfig.defaultChainId;
export const farmChain = helperConfig.networks[farmChainId][1];
export const farmAddress =
  deploymentsMap[farmChainId]["TransparentUpgradeableProxy"][0];

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

export const useTokens = (): string[] => {
  const [tokens, setTokens] = useState<string[]>([]);
  const { Moralis, isInitialized } = useMoralis();

  useEffect(() => {
    if (isInitialized)
      (async () => {
        const options: {
          abi: {}[];
          chain: "bsc" | "bsc testnet";
          address: string;
          function_name: string;
        } = {
          abi: farmAbi,
          chain: farmChain,
          address: farmAddress,
          function_name: "getTokens",
        };
        const response = await Moralis.Web3API.native.runContractFunction(
          options
        );
        setTokens(response as unknown as string[]);
      })();
  }, [isInitialized]);

  return tokens;
};

export const useTokensData = (tokenAddresses: string[]): {} => {
  const [tokensData, setTokensData] = useState<{}>({});
  const { Moralis } = useMoralis();

  useEffect(() => {
    if (tokenAddresses.length > 0)
      tokenAddresses.forEach(async (tokenAddress) => {
        const options: {
          abi: {}[];
          chain: "bsc" | "bsc testnet";
          address: string;
          function_name: string;
          params: {};
        } = {
          abi: farmAbi,
          chain: farmChain,
          address: farmAddress,
          function_name: "getTokenData",
          params: { _token: tokenAddress },
        };
        const response = await Moralis.Web3API.native.runContractFunction(
          options
        );
        const tokenData: TokenData = {
          address: tokenAddress,
          isActive: response[0] === "true",
          isVerified: response[1] === "true",
          hasMultiTokenRewards: response[2] === "true",
          name: response[3],
          category: parseInt(response[4]),
          price: parseFloat(Moralis.Units.FromWei(response[5])),
          rewardBalance: parseFloat(Moralis.Units.FromWei(response[6])),
          stakingBalance: parseFloat(Moralis.Units.FromWei(response[7])),
          stakingApr: parseFloat(Moralis.Units.FromWei(response[8])),
          rewardToken: response[9],
          admin: response[10],
          devDepositFee: parseFloat(Moralis.Units.FromWei(response[11][0])),
          devWithdrawFee: parseFloat(Moralis.Units.FromWei(response[11][1])),
          devStakeFee: parseFloat(Moralis.Units.FromWei(response[11][2])),
          devUnstakeFee: parseFloat(Moralis.Units.FromWei(response[11][3])),
          adminStakeFee: parseFloat(Moralis.Units.FromWei(response[11][4])),
          adminUnstakeFee: parseFloat(Moralis.Units.FromWei(response[11][5])),
          timestampAdded: parseInt(Moralis.Units.FromWei(response[12])),
          timestampLastUpdated: parseInt(Moralis.Units.FromWei(response[13])),
        };
        // const tokenData: TokenData = {
        //   address: tokenAddress,
        //   isActive: response["isActive"],
        //   isVerified: response["isVerified"],
        //   hasMultiTokenRewards: response["hasMultiTokenRewards"],
        //   name: response["name"],
        //   category: parseInt(response["category"]),
        //   price: parseFloat(Moralis.Units.FromWei(response["price"])),
        //   rewardBalance: parseFloat(
        //     Moralis.Units.FromWei(response["rewardBalance"])
        //   ),
        //   stakingBalance: parseFloat(
        //     Moralis.Units.FromWei(response["stakingBalance"])
        //   ),
        //   stakingApr: parseFloat(
        //     Moralis.Units.FromWei(response["stakingApr"])
        //   ),
        //   rewardToken: response["rewardToken"],
        //   admin: response["admin"],
        //   devDepositFee: parseFloat(
        //     Moralis.Units.FromWei(response["fees"]["devDepositFee"])
        //   ),
        //   devWithdrawFee: parseFloat(
        //     Moralis.Units.FromWei(response["fees"]["devWithdrawFee"])
        //   ),
        //   devStakeFee: parseFloat(
        //     Moralis.Units.FromWei(response["fees"]["devStakeFee"])
        //   ),
        //   devUnstakeFee: parseFloat(
        //     Moralis.Units.FromWei(response["fees"]["devUnstakeFee"])
        //   ),
        //   adminStakeFee: parseFloat(
        //     Moralis.Units.FromWei(response["fees"]["adminStakeFee"])
        //   ),
        //   adminUnstakeFee: parseFloat(
        //     Moralis.Units.FromWei(response["fees"]["adminUnstakeFee"])
        //   ),
        //   timestampAdded: parseInt(
        //     Moralis.Units.FromWei(response["timestampAdded"])
        //   ),
        //   timestampLastUpdated: parseInt(
        //     Moralis.Units.FromWei(response["timestampLastUpdated"])
        //   ),
        // };
        setTokensData((prevTokensData) => ({
          ...prevTokensData,
          [tokenAddress]: tokenData,
        }));
      });
  }, [tokenAddresses]);

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
