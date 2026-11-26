import { config } from "./config.ts";
import { createServer } from "./server.ts";
import OpenRouterService from "./services/openrouter.service.ts";

const routerService = new OpenRouterService(config);
const app = createServer(routerService);

await app.listen({ port: 3000, host: "0.0.0.0" });
app.log.info("server running at 3000");

app
  .inject({
    method: "POST",
    url: "/chat",
    body: { question: "What is Quantitative Trading?" },
  })
  .then((response) => {
    console.log("Response status", response.statusCode);
    console.log("Response body", response.body);
  });
