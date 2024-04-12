/* Instruments */
import type { ReduxState } from "@/lib/redux";

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: ReduxState) => state.counter.value;
export const selectFullData = (state: ReduxState) => state.counter.fullData;
export const selectElementsJsonData = (state: ReduxState) =>
  state.counter.elementsData;
export const alternativeNodesSelector = (state: ReduxState) =>
  state.counter.alternativeNodes;
export const alternativeEdgesSelector = (state: ReduxState) =>
  state.counter.alternativeEdges;
export const selectTextForTweets = (state: ReduxState) =>
  state.counter.tweetsWithText;
export const selectLogEvents = (state: ReduxState) => state.counter.logData;
export const lastEvent = (state: ReduxState) => state.counter.lastEvent;

export const points = (state: ReduxState) => state.counter.points;
