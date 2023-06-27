#!/usr/bin/env node

import "../src/lib/completion.js";
import "../src/core/globals.js";
import "../src/lib/header.js";

import Config from "../src/lib/config.js";
import { autocompleteInput } from "../src/core/prompts.js";
import * as operations from "../src/opts/index.js";
import updateNotifier from "update-notifier";

updateNotifier({
  pkg: { name: PKG_NAME, version: PKG_VERSION },
  updateCheckInterval: 0,
}).notify({ isGlobal: true });

const noop = () => {};
process.env.HUSKY = 0;
process.on("uncaughtException", $.verbose ? console.error : noop);
process.on("unhandledRejection", $.verbose ? console.error : noop);
process.on("SIGINT", process.exit);

if (argv._.includes("trigger")) {
  const [, workflow] = argv._;
  await operations.workflows(workflow);
  process.exit();
}

if (argv.reset || argv._.includes("reset")) await Config.reset();

const { operation } = await autocompleteInput("operation", operations.list);
const { options } = operations.list().find((x) => x.name === operation);

await operations[operation](options);
