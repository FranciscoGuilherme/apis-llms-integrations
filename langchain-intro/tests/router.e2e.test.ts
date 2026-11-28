import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "../src/server.ts";

test("command upper transforms me", async () => {
  const app = createServer();
  const msg = "make THIS message UPPER please!";
  const expected = msg.toUpperCase();
  const response = await app.inject({
    method: "POST",
    url: "/chat",
    body: {
      question: msg,
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body, expected);
});
