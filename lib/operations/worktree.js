/* eslint-disable */
import { stringInput, autocompleteInput, confirmInput } from '../steps/prompts.js'

export default async () => {
  head(import.meta)

  const { action } = await autocompleteInput('action', ['list', 'add'])

  switch (action) {
    case 'add': log.fatal('NOT IMPLEMENTED!')
    case 'list': await $$`git worktree list`
  }

  // log.fatal('NOT IMPLEMENTED!')
}
