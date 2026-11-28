import { END, MessagesZodMeta, START, StateGraph } from "@langchain/langgraph";
import { withLangGraph } from "@langchain/langgraph/zod";
import { BaseMessage } from "langchain";
import { z } from "zod/v3";
import { chatResponseNode } from "./nodes/chat-response.node.ts";
import { identifyIntentNode } from "./nodes/identify-intent.node.ts";
import { lowerCaseNode } from "./nodes/lower-case.node.ts";
import { upperCaseNode } from "./nodes/upper-case.node.ts";

export const GraphState = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
  output: z.string(),
  command: z.enum(["uppercase", "lowercase", "unknown"]),
});

export type GraphState = z.infer<typeof GraphState>;

export function buildGraph() {
  const workflow = new StateGraph({
    stateSchema: GraphState,
  })
    .addNode("identifyIntentNode", identifyIntentNode)
    .addNode("chatResponseNode", chatResponseNode)
    .addNode("upperCaseNode", upperCaseNode)
    .addNode("lowerCaseNode", lowerCaseNode)
    .addEdge(START, "identifyIntentNode")
    .addConditionalEdges(
      "identifyIntentNode",
      (state: GraphState) => {
        switch (state.command) {
          case "uppercase":
            return "uppercase";
          case "lowercase":
            return "lowercase";
          default:
            "";
            return "fallback";
        }
      },
      {
        uppercase: "upperCaseNode",
        lowercase: "lowerCaseNode",
      },
    )
    .addEdge("upperCaseNode", "chatResponseNode")
    .addEdge("lowerCaseNode", "chatResponseNode")
    .addEdge("chatResponseNode", END);

  return workflow.compile();
}
