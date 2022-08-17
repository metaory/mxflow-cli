import Prompt from 'enquirer'
const enquirer = new Prompt()

export const stringInput = (name, { message, value = '' } = {}) => enquirer.prompt({
  type: 'input',
  name,
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
