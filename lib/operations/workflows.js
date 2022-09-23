import pupa from 'pupa'
import clipboard from 'clipboardy'
import { promptBranchName, promptBranchType } from '../steps/prompts.js'

// -------------------

export default async(workflow) => {
  head(import.meta, 'workflows')

  const branchType = workflow ?? await getBranchType()

  const { branchName, taskId } = await promptBranchName(branchType)

  const commands = getCommands(branchType)

  await $$(commands, { taskId, branchType, branchName })

  logBugTrackerUrl({ taskId, branchType, branchName })
}

// -------------------
const getBranchTypes = () => Object.keys(cfg.workflows)

const getBranchType = () => promptBranchType([...getBranchTypes()])

const getCommands = (branchType) => {
  const commands = cfg.workflows[branchType].steps
  if (!commands) {
    log.fatal('no workflow for branchType', branchType, REL_CONFIG_PATH)
  }
  return commands
}

function logBugTrackerUrl(data) {
  function getUrl() {
    switch (cfg.issue_tracker) {
      case 'jira':
        return `https://${cfg.issue_tracker_tenant}.atlassian.net/browse/{taskId}`
      case 'clickup':
        return `https://app.clickup.com/t/${cfg.issue_tracker_tenant}/{taskId}`
      default: return 'NA'
    }
  }
  if (cfg.issue_tracker && data && data.taskId) {
    const url = pupa(getUrl(), data)
    clipboard.writeSync(url)
    console.log()
    log.greenBox(url, { title: 'bug tracker' })
    L.loading('link', 'copied to clipboard')
  }
}
