import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { farmChain } from "../hooks/farm";
import { Token } from "./Main";

export const AddTokenForm = (props: {
  tokens: Token[];
  tokensAreUpdated: boolean;
}) => {
  const { tokens, tokensAreUpdated } = props;
  const {
    Moralis,
    chainId,
    account: walletAddress,
    isAuthenticated: walletIsConnected,
    authenticate: connectWallet,
    logout: disconnectWallet,
  } = useMoralis();

  // const { notifications } = useNotifications();

  const [address, setAddress] = useState("");
  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
  };

  const [category, setCategory] = useState("0");
  const handleChangeCategory = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    if (newCategory === "0") setName("");
    if (newCategory === "1")
      setName(
        (name1 !== "" ? name1 : "NAME1") +
          "-" +
          (name2 !== "" ? name2 : "NAME2")
      );
  };

  const [name, setName] = useState("");
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
  };
  const [name1, setName1] = useState("");
  const handleChangeName1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName1 = event.target.value;
    setName1(newName1);
  };
  const [name2, setName2] = useState("");
  const handleChangeName2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName2 = event.target.value;
    setName2(newName2);
  };
  useEffect(() => {
    if (category === "1")
      setName(
        (name1 !== "" ? name1 : "NAME1") +
          "-" +
          (name2 !== "" ? name2 : "NAME2")
      );
  }, [name1, name2]);

  const [stakingApr, setStakingApr] = useState("");
  const handleChangeStakingApr = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStakingApr = event.target.value;
    setStakingApr(newStakingApr);
  };

  const [rewardToken, setRewardToken] = useState("default");
  const handleChangeRewardToken = (event: SelectChangeEvent) => {
    const newRewardToken = event.target.value;
    setRewardToken(newRewardToken);
  };

  const [adminStakeFee, setAdminStakeFee] = useState("");
  const handleChangeAdminStakeFee = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAdminStakeFee = event.target.value;
    setAdminStakeFee(newAdminStakeFee);
  };

  const [adminUnstakeFee, setAdminUnstakeFee] = useState("");
  const handleChangeAdminUnstakeFee = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAdminUnstakeFee = event.target.value;
    setAdminUnstakeFee(newAdminUnstakeFee);
  };

  const setNameFromAddress = (address: string) => {
    const ethers = Moralis.web3Library;
    if (ethers.utils.isAddress(address)) {
      if (category === "0")
        (async () => {
          setName(
            (
              await Moralis.Web3API.token.getTokenMetadata({
                chain: farmChain,
                addresses: [address],
              })
            )[0].symbol
          );
        })();
    }
  };
  useEffect(() => {
    if (address) setNameFromAddress(address);
  }, [address, category]);

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            label="Address"
            fullWidth
            value={address}
            onChange={handleChangeAddress}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={category}
              onChange={handleChangeCategory}
            >
              <MenuItem value="0">DEFAULT</MenuItem>
              <MenuItem value="1">LP</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label="Name"
            variant={category === "1" ? "filled" : undefined}
            disabled={category === "1"}
            fullWidth
            value={name}
            onChange={handleChangeName}
          />
          {category === "1" ? (
            <Grid container spacing={3} pt="10px">
              <Grid item xs={6}>
                <TextField
                  required
                  label="Name 1"
                  fullWidth
                  value={name1}
                  onChange={handleChangeName1}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  label="Name 2"
                  fullWidth
                  value={name2}
                  onChange={handleChangeName2}
                />
              </Grid>
            </Grid>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            type="number"
            label="Staking APR"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            fullWidth
            value={stakingApr}
            onChange={handleChangeStakingApr}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Reward Token</InputLabel>
            <Select
              label="Reward Token"
              value={rewardToken}
              onChange={handleChangeRewardToken}
            >
              <MenuItem value="default">SAME AS TOKEN</MenuItem>
              {tokens.map((token) =>
                token.admin.toLowerCase() === walletAddress?.toLowerCase() ? (
                  <MenuItem key={token.name} value={token.address}>
                    {token.name}
                  </MenuItem>
                ) : null
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            type="number"
            label="Stake Fee (Admin)"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            fullWidth
            value={adminStakeFee}
            onChange={handleChangeAdminStakeFee}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            type="number"
            label="Unstake Fee (Admin)"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            fullWidth
            value={adminUnstakeFee}
            onChange={handleChangeAdminUnstakeFee}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox color="secondary" name="saveAddress" value="yes" />
            }
            label="Use this address for payment details"
          />
        </Grid> */}
      </Grid>
    </React.Fragment>
  );
};
