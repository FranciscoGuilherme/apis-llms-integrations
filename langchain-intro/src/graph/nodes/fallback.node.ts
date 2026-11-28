import { AIMessage } from "langchain";
import { GraphState } from "../graph.ts";

export function fallbackNode(state: GraphState): GraphState {
  const message = "Unknown command. Try 'make this upper' or 'to lower'";
  const fallbackMessage = new AIMessage(message);

  return {
    ...state,
    output: message,
    messages: [...state.messages, fallbackMessage],
  };
}
