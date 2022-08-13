// const { prompt } = require('enquirer')
//
// const percentInput = (name, min = 0, max = 1) => prompt({
//   type: 'numeral',
//   name,
//   message: `enter ${name}`,
//   format: (val) => val.toLocaleString('en-US', { style: 'percent' }),
//   validate: (val, state) => {
//     const _val = Number(`.${val < 10 ? String(val).padStart(2, 0) : val}`)
//     if (_val >= min && _val <= max) {
//       state.value = _val
//       return true
//     } else {
//       state.value = ''
//       return `rate must be between ${min * 100}-${max * 100}`
//     }
//   }
// })
//
// const formatCurrency = (n, currency = 'USD') => n.toLocaleString('en-US',
//   { style: 'currency', currency })
//
// const currencyInput = (name, min, max) => prompt({
//   type: 'numeral',
//   name,
//   message: `enter ${name}`,
//   format: formatCurrency,
//   validate: (val, state) => {
//     if (val >= min && val <= max) {
//       return true
//     } else {
//       state.value = ''
//       return `${name} must be between` + '\n' +
//         `${formatCurrency(min)} - ${formatCurrency(max)}`
//     }
//   }
// })
//
// const stringInput = (name) => prompt({
//   type: 'input',
//   name,
//   message: `enter ${name}`,
//   validate: (val) => !!val || `${name} cant be empty!`
// })
//
// const listInput = (name, choices) => prompt({
//     type: 'select',
//     name,
//     message: `select ${name}`,
//     limit: 7,
//     choices
// })
//
// module.exports = {
//   percentInput,
//   currencyInput,
//   stringInput,
//   listInput
// }
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


