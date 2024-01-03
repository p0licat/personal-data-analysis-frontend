/* Instruments */
import type { ReduxThunkAction } from "@/lib/redux";
import { createAppAsyncThunk } from "@/lib/redux/createAppAsyncThunk";
import axios from "axios";
import {
  GetPointsDTO,
  ResponseDTO,
  TextForTweetDTO,
} from "../graphDataSlice/types";
import { counterSlice } from "./counterSlice";
import { fetchIdentityCount } from "./fetchIdentityCount";
import { selectCount } from "./selectors";

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const incrementAsync = createAppAsyncThunk(
  "counter/fetchIdentityCount",
  async (amount: number) => {
    const response = await fetchIdentityCount(amount);

    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const queryTweetTextForSingleId = createAppAsyncThunk(
  "counter/queryTweetText",
  async (tweetId: string) => {
    const result = await axios.get<TextForTweetDTO>(
      `https://test-reactui.azurewebsites.net/api/getTweetTextForId?code=7Is0LlFMvFd9ZIJSR6Kifjz9jFBQDPp84-0hzx0fCEapAzFuDEVzFw==&id=` +
        tweetId
    );

    return result.data;
  }
);

export const refreshPoints = createAppAsyncThunk(
  "counter/fetchAvailablePoints",
  async () => {
    console.log("Unsupported protocol error?");
    console.log("Getting points.");
    let result = await axios.get<GetPointsDTO>(
      `https://test-reactui.azurewebsites.net/api/getPoints?code=8KvLgCE16Jg9hNOJs9ieun7_13USAdraykI84dBDl9PsAzFuNwOYuQ==`
    );
    console.log("Unsupported protocol error?");
    console.log(
      `${process.env.NEXT_PUBLIC_REMOTE_ADDR_AZ}` +
        `:${process.env.NEXT_PUBLIC_REMOTE_PORT_AZ_4}` +
        `/getPoints`
    );
    return result.data;
  }
);

export const fetchGraphDataFromTextAsync = createAppAsyncThunk(
  "counter/fetchGraphDataFromText",
  async (startingText: string) => {
    let result: any;
    if (startingText == "") {
      result = await axios.get<ResponseDTO>(
        `${process.env.NEXT_PUBLIC_REMOTE_ADDR_AZ}` +
          `:${process.env.NEXT_PUBLIC_REMOTE_PORT_AZ_1}` +
          `/getPickledGraphForTestUI` // todo: url builder
      );
      console.log("Ran default query without ID.");
    } else {
      let data = JSON.stringify({
        text: startingText,
      });
      let config = {
        method: "post",
        url: `https://test-reactui.azurewebsites.net/api/getFullGraphFromText?code=lWs290-23KhM4FJrHtNmyXHjfi8-2EAALBmORT2o0qOvAzFuep9D7Q==`,
        //url: `http://localhost:7071/api/getFullGraphFromText`,
        headers: { "Content-Type": "application/json" },
        data: data,
      };
      result = await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          return response;
        })
        .catch((error) => {
          console.log(error);
        });
      console.log("Ran explicit query with ID.");
    }
    console.log("Got result...");
    console.log(result);
    //JSON.parse(result.data)

    return result.data;
  }
);

export const fetchGraphDataAsync = createAppAsyncThunk(
  "counter/fetchGraphData",
  async (startingId: string) => {
    let result: any;
    if (startingId == "") {
      result = await axios.get<ResponseDTO>(
        `${process.env.NEXT_PUBLIC_REMOTE_ADDR_AZ}` +
          `:${process.env.NEXT_PUBLIC_REMOTE_PORT_AZ_1}` +
          `/getPickledGraphForTestUI` // todo: url builder
      );
      console.log("Ran default query without ID.");
    } else {
      result = await axios.get<ResponseDTO>(
        `https://test-reactui.azurewebsites.net/api/getGeneratedGraphFromStartingTweetId?code=duVrLpH607nBX82XjV_xwlOX7TNv2vemSiWHEY1jDmCkAzFuv7gN_A==&id=` +
          //`http://localhost:7071/api/getGeneratedGraphFromStartingTweetId?id=` +
          startingId // todo: url builder
      );
      console.log("Ran explicit query with ID.");
    }
    console.log("Got result...");
    console.log(result);
    //JSON.parse(result.data)
    console.log(result.data.elements);

    return result.data;
  }
);

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOddAsync =
  (amount: number): ReduxThunkAction =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());

    if (currentValue % 2 === 1) {
      dispatch(counterSlice.actions.incrementByAmount(amount));
    }
  };
