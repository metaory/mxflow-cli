/* eslint-disable */
import { stringInput, autocompleteInput, confirmInput } from '../steps/prompts.js'

export default async () => {
  head(import.meta)

  const { action } = await autocompleteInput('action', ['list', 'add', 'remove'])

  switch (action) {
    case 'add':
      const { branchName } = await stringInput('branchName', { value: 'test' })
      const { path } = await stringInput('path', { value: `./${branchName}` })
      $$([`git worktree add -b ${branchName} ${path}`])
      break
    case 'list': {
      const worktree = await pickWorktree()
      L.warn(worktree)
      await cd(worktree)
      await $$`git status --short`
      break
    }
    case 'remove': {
      const worktree = await pickWorktree()
      L.warn(worktree)
      $$([`git worktree remove ${worktree}`])
      break
    }
  }

}
async function pickWorktree() {
  const { stdout } = await $`git worktree list`
  const list = stdout
    .split('\n')
    .map(x => x.split(' '))
    .reduce((acc, cur) => {
      acc.push(cur[0])
      return acc
    }, [])
  const { worktree } = await autocompleteInput('worktree', list)
  return worktree
}
