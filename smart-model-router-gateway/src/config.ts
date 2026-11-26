import { ProviderSort } from "@openrouter/sdk/models";

console.assert(
  process.env.OPENROUTER_API_KEY,
  "OPENROUTER_API_KEY is not set in env variables",
);

export type ModelConfig = {
  apiKey: string;
  httpReferer: string;
  xTitle: string;
  port: number;
  models: string[];
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  provider: {
    sort: {
      by: ProviderSort;
      partition: string;
    };
  };
};

export const config: ModelConfig = {
  apiKey: process.env.OPENROUTER_API_KEY!,
  httpReferer: "http://pos-ia.com",
  xTitle: "SmartModelRouterGateway",
  port: 3000,
  models: [
    //"openrouter/free",
    "cohere/north-mini-code:free",
    "particle-ai/particle-1:free",
  ],
  temperature: 0.2,
  maxTokens: 200,
  systemPrompt: "You are a helpful assistant",
  provider: {
    sort: {
      by: "latency",
      partition: "none",
    },
  },
};
