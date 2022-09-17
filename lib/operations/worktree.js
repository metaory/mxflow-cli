/* eslint-disable */
import { stringInput, autocompleteInput, confirmInput } from '../prompts.js'

export default async () => {
  head(import.meta)

  const { action } = await autocompleteInput('action', ['list', 'add'])

  switch (action) {
    case 'add': log.fatal('NOT IMPLEMENTED!')
    case 'list': await runCommands(['git_workflow_list'])
  }

  // log.fatal('NOT IMPLEMENTED!')
}
