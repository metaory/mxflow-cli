import { promptBranchType, promptArgs } from '../steps/prompts.js'

export default async(argWorkflow) => {
  head(import.meta, argWorkflow)

  const workflow = argWorkflow ?? await getBranchType()
  if (!cfg.workflows[workflow]) {
    L.error(`workflow ${C.bold(workflow)} not found in config`)
  }

  const { args, steps } = cfg.workflows[workflow]
  const context = await promptArgs(args, workflow)

  await $$(steps, { workflow, ...context })
}

const getBranchType = () => promptBranchType([...Object.keys(cfg.workflows)])
