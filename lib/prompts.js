import Prompt from 'enquirer'
const enquirer = new Prompt()

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

export const promptBranch = async(branchTypes) => {
  const { branchType } = await autocompleteInput('branchType', branchTypes)
  const { taskId } = await stringInput('taskId')
  const { description } = await stringInput('description')

  return {
    branchType,
    branchName: `${branchType}/${taskId}-${description}`
  }
}

