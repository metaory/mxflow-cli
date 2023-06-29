import { promptWorkflow, promptArgs } from "./prompts.js";
import runChecks from "../opts/checks.js";

export default async (argWorkflow) => {
  head(import.meta, argWorkflow);

  const workflow =
    argWorkflow ??
    (await promptWorkflow([...Object.keys(cfg.workflows).sort()]));

  if (!cfg.workflows[workflow]) {
    L.error(`workflow ${C.bold(workflow)} not found in config`);
  }

  const { args, steps, checks = [] } = cfg.workflows[workflow];

  await runChecks(checks);

  const context = await promptArgs(workflow, args);

  await $$(steps, { workflow, ...context });
};
