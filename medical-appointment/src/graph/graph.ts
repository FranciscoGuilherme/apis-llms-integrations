import type { BaseMessage } from "@langchain/core/messages";
import { END, MessagesZodMeta, START, StateGraph } from "@langchain/langgraph";
import { withLangGraph } from "@langchain/langgraph/zod";

import { createCancellerNode } from "./nodes/canceller.node.ts";
import { createIdentifyIntentNode } from "./nodes/identify-intent.node.ts";
import { createMessageGeneratorNode } from "./nodes/message-generator.node.ts";
import { createSchedulerNode } from "./nodes/scheduler.node.ts";

import { z } from "zod/v3";

const AppointmentStateAnnotation = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),

  patientName: z.string().optional(),

  intent: z.enum(["schedule", "cancel", "unknown"]).optional(),
  professionalId: z.number().optional(),
  professionalName: z.string().optional(),
  datetime: z.string().optional(),
  reason: z.string().optional(),

  actionSuccess: z.boolean().optional(),
  actionError: z.string().optional(),
  appointmentData: z.any().optional(),

  error: z.string().optional(),
});

export type GraphState = z.infer<typeof AppointmentStateAnnotation>;

export function buildAppointmentGraph() {
  // Build workflow graph
  const workflow = new StateGraph({
    stateSchema: AppointmentStateAnnotation,
  })
    .addNode("identifyIntent", createIdentifyIntentNode())
    .addNode("schedule", createSchedulerNode())
    .addNode("cancel", createCancellerNode())
    .addNode("message", createMessageGeneratorNode())

    // Flow
    .addEdge(START, "identifyIntent")

    // Route based on intent
    .addConditionalEdges(
      "identifyIntent",
      (state: GraphState): string => {
        if (state.error || !state.intent || state.intent === "unknown") {
          return "message";
        }

        console.log(`➡️  Routing based on intent: ${state.intent}`);
        return state.intent;
      },
      {
        schedule: "schedule",
        cancel: "cancel",
        message: "message",
      },
    )

    .addEdge("schedule", "message")
    .addEdge("cancel", "message")
    .addEdge("message", END);

  return workflow.compile();
}
