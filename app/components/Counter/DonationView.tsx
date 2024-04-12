import { Grid } from "@mui/material";

import ether_wallet_image from "./ether_good.png";
import styles from "./counter.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { points } from "@/lib/redux/slices/counterSlice/selectors";
import { refreshPoints } from "@/lib/redux/slices/counterSlice/thunks";

import Web3 from "web3";
import { fromWei } from "web3-utils";

export default interface DonationViewProps {
  logEvents: string[];
}

export const DonationView = (props: DonationViewProps) => {
  const web3 = new Web3(
    "https://mainnet.infura.io/v3/c8116ff463994648ab726d964a74957e"
  );
  const etherAddr = "0xd3f714E88f72f7E2BD2ae1DdedB1aB5bC4A0597e" as string;
  const [etherBalance, setEtherBalance] = useState("0");
  const pointsFrontend = useSelector(points);

  const dispatch: any = useDispatch();

  useEffect(() => {
    console.log("refreshing points");
    dispatch(refreshPoints());
    web3.eth.getBalance(etherAddr).then((balance: bigint) => {
      setEtherBalance(fromWei(balance, "ether"));
    });
  }, [props.logEvents]);

  return (
    <Grid container>
      <Grid
        item
        xs={8}
        style={{ paddingLeft: "12px", paddingRight: "12px", width: "710px" }}
      >
        <img
          src={String(ether_wallet_image.src)}
          className={styles.logo}
          alt="logo"
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <p>Ether addr: {etherAddr.toString()}</p>
        <p>Ether balance: {etherBalance.toString()} Ξ (ETH)</p>
        <p>Points: {pointsFrontend.toString()}</p>
      </Grid>
    </Grid>
  );
};
