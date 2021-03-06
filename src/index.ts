import http from "http";
import app from "./lib/server";

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
let currentHandler = app.callback();
const server = http.createServer(currentHandler);

server.listen(process.env.PORT || 3000, () => {
  console.log("🚀 started");
});

if (module.hot) {
  console.log("✅  Server-side HMR Enabled!");

  module.hot.accept(["./lib/server"], () => {
    console.log("🔁  HMR Reloading `./server`...");

    try {
      const newHandler = require("./lib/server").default.callback();
      server.removeListener("request", currentHandler);
      server.on("request", newHandler);
      currentHandler = newHandler;
    } catch (error) {
      console.error(error);
    }
  });
}
