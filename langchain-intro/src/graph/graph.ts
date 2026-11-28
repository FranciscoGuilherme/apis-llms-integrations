import { END, MessagesZodMeta, START, StateGraph } from "@langchain/langgraph";
import { withLangGraph } from "@langchain/langgraph/zod";
import { BaseMessage } from "langchain";
import { z } from "zod/v3";
import { chatResponseNode } from "./nodes/chat-response.node.ts";
import { identifyIntentNode } from "./nodes/identify-intent.node.ts";

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
    .addNode("identifyIntent", identifyIntentNode)
    .addNode("chatResponseNode", chatResponseNode)
    .addEdge(START, "identifyIntent")
    .addEdge("identifyIntent", "chatResponseNode")
    .addEdge("chatResponseNode", END);

  return workflow.compile();
}
