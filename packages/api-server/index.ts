import express from "express";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure.query(() => {
    return "hi";
  }),
  logToServer: t.procedure
    .input((v) => {
      if (typeof v === "string") return v;

      throw new Error("Invalid input: expected string");
    })
    .mutation((req) => {
      console.log(`client says: ${req.input}`);
      return true;
    }),
});

const app = express();

const port = 8080;

app.use(cors());

app.use("/trpc", createExpressMiddleware({ router: appRouter }));

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});

export type AppRouter = typeof appRouter;
