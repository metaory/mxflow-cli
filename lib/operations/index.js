import checkConflict from './checkConflict.js'
import startWorkflow from './startWorkflow.js'
import checkoutBranch from './checkoutBranch.js'
import cherryPick from './cherryPick.js'
import { resetConfig } from '../config.js'

const list = [
  { name: 'cherryPick', message: 'interactive cherry pick', disabled: true },
  { name: 'checkConflict', message: 'check for conflicts' },
  { name: 'startWorkflow', message: 'start new workflow' },
  { name: 'checkoutBranch', message: 'checkout Branch' },
  { name: 'resetConfig', message: 'reset config file' },
  { name: 'PR_toLanding', message: 'create pull request', disabled: true },
  { name: 'install_husky_hook', message: 'install husky hook', disabled: true }
]

export {
  checkConflict,
  startWorkflow,
  checkoutBranch,
  cherryPick,
  list,
  resetConfig
}
