import pupa from 'pupa'
import { promptBranchName, promptBranchType } from '../steps/prompts.js'

// -------------------

export default async() => {
  head(import.meta, 'workflows')

  const branchType = await getBranchType()

  const { branchName, taskId } = await promptBranchName(branchType)

  const commands = getCommands(branchType)

  await runCommands(commands, { taskId, branchType, branchName })

  logBugTrackerUrl({ taskId, branchType, branchName })
}

// -------------------
const getBranchTypes = () => Object.keys(cfg.workflows)
  .reduce((acc, cur) => {
    if (!cur.includes('__')) {
      acc.push(cur)
    }
    return acc
  }, [])

const getBranchType = async() => promptBranchType([...getBranchTypes()])

const getCommands = (branchType) => {
  const commands = cfg.workflows[branchType]
  if (!commands) {
    log.fatal('no workflow for branchType', branchType, REL_CONFIG_PATH)
  }
  return commands
}

function logBugTrackerUrl(data) {
  if (data && data.taskId) {
    log.greenBox(
      pupa(cfg.bug_tracker_path, data), { title: 'bug tracker' }
    )
  }
}
