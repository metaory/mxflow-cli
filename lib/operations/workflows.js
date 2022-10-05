import { promptBranchName, promptBranchType } from '../steps/prompts.js'

// -------------------

export default async(workflow) => {
  head(import.meta, workflow)

  const branchType = workflow ?? await getBranchType()
  if (!cfg.workflows[branchType]) {
    L.error(`workflow ${C.bold(branchType)} not found in config`)
  }
  const { branchName, taskId } = await promptBranchName(branchType)

  const commands = cfg.workflows[branchType].steps

  await $$(commands, { taskId, branchType, branchName })
}

// -------------------
const getBranchTypes = () => Object.keys(cfg.workflows)

const getBranchType = () => promptBranchType([...getBranchTypes()])
