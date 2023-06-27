import { promptWorkflow, promptArgs } from "../steps/prompts.js";
import runChecks from "../operations/checks.js";

export default async (argWorkflow) => {
  head(import.meta, argWorkflow);

  const workflow = argWorkflow ?? (await getWorkflow());
  if (!cfg.workflows[workflow]) {
    L.error(`workflow ${C.bold(workflow)} not found in config`);
  }

  const { args, steps, checks = [] } = cfg.workflows[workflow];

  await runChecks(checks);

  const context = await promptArgs(workflow, args);

  await $$(steps, { workflow, ...context });
};

const configWorkflows = () => [...Object.keys(cfg.workflows).sort()];
const getWorkflow = () => promptWorkflow(configWorkflows());
