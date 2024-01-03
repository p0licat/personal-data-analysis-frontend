"use client";

/* Core */
import { useEffect, useState } from "react";

/* Instruments */
import {
  alternativeEdgesSelector,
  alternativeNodesSelector,
  counterSlice,
  fetchGraphDataAsync,
  fetchGraphDataFromTextAsync,
  lastEvent,
  points,
  queryTweetTextForSingleId,
  refreshPoints,
  selectLogEvents,
  selectTextForTweets,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { ShoppingCartRounded, SearchRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Input,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./counter.module.css";

import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import CytoscapeComponent from "react-cytoscapejs";
import { TextForTweet } from "@/lib/redux/slices/graphDataSlice/types";
import { TweetCard } from "../TweetCard/TweetCard";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import { fromWei } from "web3-utils";
import ether_wallet_image from "./ether_good.png";

cytoscape.use(fcose);

export const Counter = () => {
  const dispatch: any = useDispatch();

  const [filterText, setFilterText] = useState(""); // used for retrieving new graph from backend

  const alternativeNodes = useSelector(alternativeNodesSelector); // graph data from reducer
  const alternativeEdges = useSelector(alternativeEdgesSelector); // graph data from reducer

  const [cy_custom, set_cy_custom] = useState<cytoscape.Core>(); // hook into lifecycle of Cy

  const [sliderValue, setSliderValue] = useState(100); // adjusts rendering parameters of Cytoscape

  const [list_selected, set_list_selected] = useState<Array<string>>([]);

  const listTweetsWithText = useSelector(selectTextForTweets);

  const logEvents = useSelector(selectLogEvents);
  const obtainedLastEvent = useSelector(lastEvent);
  const pointsFrontend = useSelector(points);

  const web3 = new Web3(
    "https://mainnet.infura.io/v3/c8116ff463994648ab726d964a74957e"
  );
  const etherAddr = "0xd3f714E88f72f7E2BD2ae1DdedB1aB5bC4A0597e" as string;
  const [etherBalance, setEtherBalance] = useState("0");

  //const [lastEvent, setLastEvent] = useState(0); // has to be moved to the store, synchronously.

  // in the text section, the selected node's URL and text data will be displayed
  // multiple selections mean text data of multiple tweets are rendered

  // first useEffect for selected behaviour of graph
  // todo: another useEffect for initial render after populating data

  useEffect(() => {
    console.log("refreshing points");
    dispatch(refreshPoints());
    web3.eth.getBalance(etherAddr).then((balance: bigint) => {
      setEtherBalance(fromWei(balance, "ether"));
    });
  }, [logEvents]);

  useEffect(() => {
    setSliderValue(sliderValue - 1);
    setSliderValue(sliderValue + 1);
  }, [alternativeEdges, alternativeNodes]);

  useEffect(() => {
    // also initialLoad()

    console.log("Running selected_list_changed handler...");
    //console.log(list_selected);
    // at this point, the async callback should be dispatched on the reducer
    // when the reducer fulfills its promise, update the Typography element.
    dispatch(counterSlice.actions.clearAllTweetsWithTextCache());
    list_selected.forEach((tweetIdText) =>
      dispatch(queryTweetTextForSingleId(tweetIdText))
    );
  }, [list_selected]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
    if (cy_custom != null) {
      cy_custom.on("cxttap", "node", (event) => {
        console.log(lastEvent);
        dispatch(
          counterSlice.actions.logEvent({
            logText:
              "Expanding graph with origin at right clicked node. Action costs 3 points.",
            eventTimeStamp: event.originalEvent.timeStamp,
          })
        );
        dispatch(fetchGraphDataAsync(event.target._private.data.id));
      });
      cy_custom.on("click", "node", (event) => {
        dispatch(
          counterSlice.actions.logEvent({
            logText: "Retrieving tweet details. Action costs 1 point.",
            eventTimeStamp: event.originalEvent.timeStamp,
          })
        );
        console.log("Running handleSliderChange event handler.");
        //console.log(event.target._private.data);
        // console.log(
        //   cy_custom.elements(":selected").map((e: any) => e._private.data)
        // );
        var list_of_selected_ids = cy_custom
          .elements(":selected")
          .map((e: any) => e._private.data.id);
        list_of_selected_ids.push(event.target._private.data.id); // add current target to list of selected
        //console.log("List selected ids: ");
        //console.log(list_of_selected_ids);
        // should dispatch an event
        console.log("Calling setter.");
        set_list_selected(list_of_selected_ids); // triggers
        console.log("Setter finalized.");
        //console.log(list_selected);
      });
    }
  };

  function logText(filterText: string) {
    console.log(alternativeEdges);
    console.log(alternativeNodes);
  }

  const onChangeHandler = function (e: any) {
    setFilterText(e.target.value);
  };

  const layout = {
    name: "fcose",
    animate: false,
    idealEdgeLength: sliderValue,
  };

  const cyElem = (
    <CytoscapeComponent
      elements={CytoscapeComponent.normalizeElements({
        nodes: alternativeNodes,
        edges: alternativeEdges,
      })}
      cy={(cy) => {
        set_cy_custom(cy);
      }}
      layout={layout}
      style={{
        width: "800px",
        height: "700px",
        border: "2px solid rgba(0, 0, 0, 0.05)",
        borderWidth: "2px"
      }}
    />
  );

  return (
    <div className={styles.div}>
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
      <Grid container>
        <Grid item xs={4}>
          {/* <Button
            variant="text"
            startIcon={<ShoppingCartRounded />}
            onClick={() => logText("")}
          >
            Print variable
          </Button> */}
          <Button
            variant="text"
            startIcon={<SearchRounded />}
            onClick={() => {
              dispatch(
                counterSlice.actions.logEvent({
                  logText:
                    "Performing search. Don't forget to move slider. Action costs 5 points.",
                  eventTimeStamp: Date.now(),
                })
              );
              //dispatch(fetchGraphDataAsync(filterText));
              dispatch(fetchGraphDataFromTextAsync(filterText));
            }}
          >
            Query graph data
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Box
            style={{
              height: "10vh",
              maxHeight: "10vh",
              overflow: "auto",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            {logEvents.map((e: any) => (
              <Typography key={uuidv4()} variant="body1">
                {e}
              </Typography>
            ))}
          </Box>
        </Grid>
      </Grid>

      <TextField
        aria-label="Demo input"
        placeholder="Insert natural language"
        value={filterText}
        onChange={onChangeHandler}
        multiline
        maxRows={4}
        style={{ width: "100%" }}
      />
      <Slider
        aria-label="Volume"
        value={sliderValue}
        onChange={handleSliderChange}
        defaultValue={50}
        min={1}
        max={2000}
        step={10}
      />
      <div className={styles.div}>{cyElem}</div>
      {/* <Typography>{listTweetsWithText.length}</Typography> */}
      <div style={{ alignContent: "center", maxWidth: "100%" }}>
        {listTweetsWithText.map((tw: any) => {
          if (tw != null)
            return (
              <TweetCard
                key={uuidv4()}
                fullText={tw.fullText!}
                fullUrl={`https://twitter.com/i/web/status/` + tw.tweetId!}
                tweetId={tw.tweetId!}
              ></TweetCard>
            );
          return "";
        })}
      </div>
    </div>
  );
};
