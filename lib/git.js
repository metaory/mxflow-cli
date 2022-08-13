export async function catchNoGit() {
  try {
    await $`git rev-parse --is-inside-work-tree`
    return true
  }
  catch (error) {
    console.error(chalk.red('NOT A GIT REPOSITORY!'))
    process.exit(1)
  }
}
