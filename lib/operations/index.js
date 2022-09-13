import checkConflict from './checkConflict.js'
import startWorkflow from './startWorkflow.js'
import checkoutBranch from './checkoutBranch.js'
import cherryPick from './cherryPick.js'
import { resetConfig } from '../config.js'

const list = () => [
  // { name: 'cherryPick', message: 'interactive cherry pick', disabled: true },
  {
    name: 'checkConflict',
    message: chalk.magenta('▲ check for conflict')
  },
  {
    name: 'startTicket',
    message: chalk.blue('◼ start new ticket workflow'),
    options: { collectType: true }
  },
  {
    name: 'startTrunk',
    message: chalk.cyan(`● start new ${cfg.trunk_branch_name} workflow`),
    options: { collectType: false }
  },
  {
    name: 'checkoutBranch',
    message: chalk.yellow('◀ checkout Branch')
  },
  {
    name: 'resetConfig',
    message: chalk.red('✖ reset config file')
  }
  // { name: 'PR_toLanding', message: 'create pull request', disabled: true },
  // { name: 'install_husky_hook', message: 'install husky hook', disabled: true }
]

export {
  checkConflict,
  startWorkflow as startTicket,
  startWorkflow as startTrunk,
  checkoutBranch,
  cherryPick,
  list,
  resetConfig
}
