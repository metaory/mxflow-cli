import checkConflict from './conflict.js'
import newWorkflow from './newWorkflow.js'

const list = [
  { name: 'commit', message: 'new commit', disabled: true },
  { name: 'newWorkflow', message: 'start new workflow', disabled: true },
  { name: 'checkConflict', message: 'check for conflicts' },
  { name: 'PR_toLanding', message: 'create PR', disabled: true }
]

export { checkConflict, newWorkflow, list }
