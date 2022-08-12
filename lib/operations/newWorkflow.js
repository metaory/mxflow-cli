import {
  stringInput,
  listInput
} from '../prompts.js'

export default async () => {
  const { branchType } = await listInput('branchType', [ 'feature', 'buglist', 'other' ])
  const { taskId } = await stringInput('taskId')
}
