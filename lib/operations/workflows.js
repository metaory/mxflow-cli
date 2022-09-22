import pupa from 'pupa'
import clipboard from 'clipboardy'
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
  const commands = cfg.workflows[branchType].steps
  if (!commands) {
    log.fatal('no workflow for branchType', branchType, REL_CONFIG_PATH)
  }
  return commands
}

function logBugTrackerUrl(data) {
  if (data && data.taskId) {
    const url = pupa(cfg.bug_tracker_path, data)
    clipboard.writeSync(url)
    log.greenBox(url, { title: 'bug tracker' })
    L.loading('link', 'copied to clipboard')
  }
}
