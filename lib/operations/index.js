import conflictDetection from './conflictDetection.js'
import workflows from './workflows.js'
// import startWorkflow from './startWorkflow.js'
import checkoutBranch from './checkout.js'
import cherryPick from './cherryPick.js'
import worktree from './worktree.js'
import { resetConfig } from '../config.js'
import { listLatestLogs } from '../git.js'

const list = () => [
  // {
  //   name: 'startTicket',
  //   message: C.bold.magenta('◼ start new ticket workflow'),
  //   options: { collectType: true }
  // },
  // {
  //   name: 'startTrunk',
  //   message: C.bold.blue(`● start new ${cfg.trunk_branch_name} workflow`),
  //   options: { collectType: false }
  // },
  {
    name: 'checkoutBranch',
    message: C.bold.yellow('◀ checkout branch')
  },
  {
    name: 'workflows',
    message: C.bold.cyan(`● start workflow`)
  },
  {
    name: 'conflictDetection',
    message: C.bold.magenta('▲ conflict detection')
  },
  {
    name: 'cherryPick',
    disabled: true,
    message: C.bold.blue('◈ cherry pick')
  },
  {
    name: 'worktree',
    message: C.bold.green('⇄ worktree') // ⭓
  },
  {
    name: 'listLatestLogs',
    message: C.bold.green('∿ graph git logs'), // ⤦ ⧕ ∿
    options: cfg.graph_git_log_limit
  },
  {
    name: 'resetConfig',
    message: C.bold.red('✖ reset config file')
  }
  // { name: 'cherryPick', message: 'interactive cherry pick', disabled: true },
  // { name: 'PR_toLanding', message: 'create pull request', disabled: true },
  // { name: 'install_husky_hook', message: 'install husky hook', disabled: true }
]

export {
  conflictDetection,
  // startWorkflow as startTicket,
  workflows,
  listLatestLogs,
  checkoutBranch,
  cherryPick,
  worktree,
  list,
  resetConfig
}
