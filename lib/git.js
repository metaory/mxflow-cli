
export async function checkIsGitDirectory() {
  console.log('checkIsGitDirectory()')
  try {
    await $`git rev-parse --is-inside-work-tree`
    return true
  }
  catch (error) {
    return false
  }
}
