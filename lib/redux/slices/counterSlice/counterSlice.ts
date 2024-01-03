/* Core */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* Instruments */
import {
  ElementsJSON,
  LoggedEvent,
  ResponseDTO,
  TextForTweet,
  TextForTweetDTO,
  UsableEdge,
  UsableNodeData,
} from "../graphDataSlice/types";
import {
  fetchGraphDataAsync,
  incrementAsync,
  queryTweetTextForSingleId,
  refreshPoints,
  fetchGraphDataFromTextAsync,
} from "./thunks";
import { lastEvent } from "../..";

const initialState: CounterSliceState = {
  value: 0,
  status: "idle",
  graphData: "",
  elementsData: { nodes: [], edges: [] },
  alternativeNodes: [],
  alternativeEdges: [],
  fullData: { elements: { edges: [], nodes: [] } },
  tweetsWithText: [],
  logData: ["Application store loaded. Log component loaded."],
  lastEvent: 0, // this is the timestamp of the last event's originator, in a reactive store lifecycle
  points: "",
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    clearAllTweetsWithTextCache: (state) => {
      console.log("Tried cleaning...");
      console.log(state.tweetsWithText);
      state.tweetsWithText = [];
      console.log("Tried cleaning...");
      console.log(state.tweetsWithText);
    },
    logEvent: (state, action: PayloadAction<LoggedEvent>) => {
      if (state.lastEvent == action.payload.eventTimeStamp) {
        return; // do not add log duplicates
      }
      state.lastEvent = action.payload.eventTimeStamp;
      state.logData.reverse();
      state.logData.push(action.payload.logText);
      state.logData.reverse();
    },
    setLastEvent: (state, action: PayloadAction<number>) => {
      state.lastEvent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value += action.payload;
      })
      .addCase(fetchGraphDataAsync.fulfilled, (state, action) => {
        state.fullData = action.payload;
        state.elementsData = action.payload.elements;
        action.payload.elements.edges.forEach((edge: any) => {
          var newEdge: UsableEdge = {
            data: { id: "", label: "", source: "", target: "" },
          };
          newEdge.data.source = edge.data.source;
          newEdge.data.target = edge.data.target;
          newEdge.data.label = "EdgeLabel";
          newEdge.data.id = "";
          state.alternativeEdges.push({
            data: {
              id: edge.data.source + edge.data.target,
              source: edge.data.source,
              target: edge.data.target,
            },
          });
        });
        action.payload.elements.nodes.forEach((node: any) => {
          var newNode: UsableNodeData = { data: { id: "", label: "" } };
          newNode.data.id = node.data.id;
          newNode.data.label = node.data.name;
          state.alternativeNodes.push(newNode);
        });
      })
      .addCase(fetchGraphDataFromTextAsync.fulfilled, (state, action) => {
        state.fullData = action.payload;
        console.log("Printing payload...");
        console.log(action.payload);
        console.log(action.payload.edges);
        action.payload.edges.forEach((edgeList: any) => {
          edgeList.forEach((edge: any) => {
            var newEdge: UsableEdge = {
              data: { id: "", label: "", source: "", target: "" },
            };
            newEdge.data.source = edge.data.source;
            newEdge.data.target = edge.data.target;
            newEdge.data.label = "EdgeLabel";
            newEdge.data.id = "";
            state.alternativeEdges.push({
              data: {
                id: edge.data.source + edge.data.target,
                source: edge.data.source,
                target: edge.data.target,
              },
            });
          });
        });

        action.payload.nodes.forEach((nodeList: any) => {
          nodeList.forEach((node: any) => {
            var newNode: UsableNodeData = { data: { id: "", label: "" } };
            newNode.data.id = node.data.id;
            newNode.data.label = node.data.name;
            state.alternativeNodes.push(newNode);
          });
        });
      })
      .addCase(queryTweetTextForSingleId.fulfilled, (state, action) => {
        let bb: TextForTweetDTO = action.payload;
        let cc: TextForTweet = bb as TextForTweet;
        state.tweetsWithText.push(cc);
      })
      .addCase(refreshPoints.fulfilled, (state, action) => {
        let numPoints: string = action.payload.points[0];
        state.points = numPoints;
      });
  },
});
/* Types */
export interface CounterSliceState {
  value: number; // todo: pending removal
  status: "idle" | "loading" | "failed";
  graphData: string; // todo: pending removal
  elementsData: ElementsJSON; // // todo: pending removal
  alternativeNodes: Array<UsableNodeData>;
  alternativeEdges: Array<UsableEdge>;
  fullData: ResponseDTO; // todo: pending removal
  tweetsWithText: Array<TextForTweet>;
  logData: Array<string>;
  lastEvent: number;
  points: string;
}
