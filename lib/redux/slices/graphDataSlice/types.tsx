import { EdgeDataDefinition } from "cytoscape";

export interface NodeData {
  id: string;
  name: string;
}

export interface UsableNodeData {
  data: {
    id: string;
    label: string;
  };
}

export interface MyNode {
  data: NodeData;
}

export interface EdgeData {
  source: string;
  target: string;
}

export interface UsableEdge {
  data: EdgeDataDefinition;
}

export interface MyEdge {
  data: EdgeData;
}

export interface GetPointsDTO {
  points: Array<string>;
}
export interface ResponseDTO {
  elements: ElementsJSON;
}

export interface ElementsJSON {
  nodes: MyNode[];
  edges: MyEdge[];
}

// region types for tweet text queries
export interface TextForTweet {
  tweetId: string;
  fullText: string;
}

export interface TextForTweetDTO {
  tweetId: string;
  fullText: string;
}
// endregion

export interface LoggedEvent {
  logText: string;
  eventTimeStamp: number;
}
