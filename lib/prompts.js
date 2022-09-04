import Prompt from 'enquirer'
import pupa from 'pupa'

const enquirer = new Prompt()

export const multiselectInput = (name, choices, message) => enquirer.prompt({
  type: 'multiselect',
  name,
  limit: 10,
  hint: '(Use <space> to select, <return> to submit)',
  initial: 0,
  message: message ?? `select ${name}`,
  choices
})

export const autocompleteInput = (name, choices, message) => enquirer.prompt({
  type: 'autocomplete',
  name,
  limit: 10,
  message: message ?? `select ${name}`,
  choices
})

export const confirmInput = (name, message = 'Are you sure?') => enquirer.prompt({
  type: 'confirm',
  name,
  message
})

export const stringInput = (name, {
  message,
  value = '',
  spaceReplacer = '_'
} = {}) => enquirer.prompt({
  type: 'input',
  name,
  result: (val) => val.trim().replaceAll(' ', spaceReplacer),
  message: message ?? `enter ${name}`,
  default: value,
  validate: (val) => !!val || `${name} cant be empty!`
})

export const listInput = (name, choices, message) => enquirer.prompt({
  type: 'select',
  name,
  message: message ?? `select ${name}`,
  limit: 7,
  choices
})

export const promptBranch = async(branchTypes, tpl) => {
  let branchType, taskId, description
  if (tpl.includes('branchType')) {
    branchType = (await autocompleteInput('branchType', branchTypes)).branchType
  }
  if (tpl.includes('taskId')) {
    taskId = (await stringInput('taskId')).taskId
  }
  if (tpl.includes('description')) {
    description = (await stringInput('description')).description
  }
  const data = { branchType, taskId, description }

  const branchName = pupa(tpl, data)

  return { branchType, branchName }
}
