import Prompt from 'enquirer'
const enquirer = new Prompt()

export const stringInput = (name, message) => enquirer.prompt({
  type: 'input',
  name,
  message: message ?? `enter ${name}`,
  validate: (val) => !!val || `${name} cant be empty!`
})

export const listInput = (name, choices) => enquirer.prompt({
  type: 'select',
  name,
  message: `select ${name}`,
  limit: 7,
  choices
})

