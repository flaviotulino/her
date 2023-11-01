const express = require("express");
const her = require("./dist");
const Joi = require("joi");

const app = express();
app.use(express.json());

const r = her.createHandler({
  path: "/",
  method: "GET",
  schema: Joi.object({
    body: Joi.boolean(),
  }),
  handler() {
    return "test";
  },
});

her.createServer({ prefix: "/api" }, [r], app);
app.listen(3000, () => console.log("done"));
