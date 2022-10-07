import { promptBranchType } from '../steps/prompts.js'

export default async(workflow) => {
  head(import.meta, workflow)

  const branchType = workflow ?? await getBranchType()
  if (!cfg.workflows[branchType]) {
    L.error(`workflow ${C.bold(branchType)} not found in config`)
  }

  const commands = cfg.workflows[branchType].steps

  await $$(commands, { branchType })
}

const getBranchTypes = () => Object.keys(cfg.workflows)

const getBranchType = () => promptBranchType([...getBranchTypes()])
