import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import axios from "axios";
import { delay, getContractAddress } from "../common";
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
        const response = (await Moralis.Web3API.native.runContractFunction(
          options
        )) as unknown as string[];
        setTokens(response);
      })();
  }, [isInitialized]);

  return tokens;
};

export const useTokensData = (tokenAddresses: string[]): {} => {
  const [tokensData, setTokensData] = useState<{}>({});
  const { Moralis } = useMoralis();

  useEffect(() => {
    if (tokenAddresses.length > 0)
      tokenAddresses.forEach(async (tokenAddress, index) => {
        await delay(1000 * index);
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
        const response = (await Moralis.Web3API.native.runContractFunction(
          options
        )) as unknown as any[];
        //////////
        /**
         * Get token price from PancakeSwap.
         * If farm on testnet, mainnet price.
         */
        const tokenSlug =
          parseInt(response[4]) === 0
            ? `${response[3].toLowerCase()}_token`
            : `${response[3].toLowerCase().replace("-", "_")}_lp_token`;
        const tokenMainnetAddress = !farmChain.includes("test")
          ? tokenAddress
          : getContractAddress(tokenSlug, "bsc-main");
        const price = (
          await Moralis.Web3API.token.getTokenPrice({
            chain: "bsc",
            exchange: "pancakeswap-v2",
            address: tokenMainnetAddress ?? "",
          })
        ).usdPrice;
        //////////
        const tokenData: TokenData = {
          address: tokenAddress,
          isActive: response[0],
          isVerified: response[1],
          hasMultiTokenRewards: response[2],
          name: response[3],
          category: parseInt(response[4]),
          price: price,
          // price: parseFloat(Moralis.Units.FromWei(response[5])),
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
        setTokensData((prevTokensData) => ({
          ...prevTokensData,
          [tokenAddress]: tokenData,
        }));
      });
  }, [tokenAddresses]);

  return tokensData;
};

export const useTokensStakerData = (
  tokenAddresses: string[],
  stakerAddress: string
): {} => {
  const [tokensStakerData, setTokensStakerData] = useState<{}>({});
  const { Moralis, isAuthenticated: walletIsConnected } = useMoralis();

  useEffect(() => {
    if (tokenAddresses.length > 0)
      tokenAddresses.forEach(async (tokenAddress, index) => {
        await delay(1000 * index);
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
          function_name: "getTokenStakerData",
          params: { _token: tokenAddress, _staker: stakerAddress },
        };
        const response = (await Moralis.Web3API.native.runContractFunction(
          options
        )) as unknown as any[];
        // prettier-ignore
        // @ts-ignore
        const walletBalance = walletIsConnected ? (await Moralis.Web3API.account.getTokenBalances({ chain: farmChain, token_addresses: [tokenAddress] }))[0].balance : 0;
        const tokenStakerData: TokenStakerData = {
          walletBalance: parseFloat(Moralis.Units.FromWei(walletBalance)),
          rewardBalance: parseFloat(Moralis.Units.FromWei(response[0])),
          stakingBalance: parseFloat(Moralis.Units.FromWei(response[1])),
          stakingRewardToken: response[2],
          stakingRewards: response[3].map((stakingReward: any) => {
            return {
              id: parseInt(stakingReward[0]),
              staker: stakingReward[1],
              rewardToken: stakingReward[2],
              rewardTokenPrice: parseFloat(
                Moralis.Units.FromWei(stakingReward[3])
              ),
              rewardTokenAmount: parseFloat(
                Moralis.Units.FromWei(stakingReward[4])
              ),
              stakedToken: stakingReward[5],
              stakedTokenPrice: parseFloat(
                Moralis.Units.FromWei(stakingReward[6])
              ),
              stakedTokenAmount: parseFloat(
                Moralis.Units.FromWei(stakingReward[7])
              ),
              stakingApr: parseFloat(Moralis.Units.FromWei(stakingReward[8])),
              stakingDurationInSeconds: parseInt(
                Moralis.Units.FromWei(stakingReward[9])
              ),
              triggeredBy: [stakingReward[10][0], stakingReward[10][1]],
              timestampAdded: parseInt(
                Moralis.Units.FromWei(stakingReward[11])
              ),
              timestampLastUpdated: parseInt(
                Moralis.Units.FromWei(stakingReward[12])
              ),
            };
          }),
          timestampLastRewarded: parseInt(Moralis.Units.FromWei(response[4])),
          timestampAdded: parseInt(Moralis.Units.FromWei(response[5])),
          timestampLastUpdated: parseInt(Moralis.Units.FromWei(response[6])),
        };
        setTokensStakerData((prevTokensStakerData) => ({
          ...prevTokensStakerData,
          [tokenAddress]: tokenStakerData,
        }));
      });
  }, [tokenAddresses]);

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
