/* eslint-disable */
import { stringInput, autocompleteInput, confirmInput } from '../steps/prompts.js'

export default async () => {
  head(import.meta)

  const { action } = await autocompleteInput('action', ['list', 'add'])

  switch (action) {
    case 'add':
      const { branchName } = await stringInput('branchName', { value: 'test' })
      const { path } = await stringInput('path', { value: `./${branchName}` })
      $$([`git worktree add -b ${branchName} ${path}`])
      break
    case 'list': await $$`git worktree list`
  }

}
