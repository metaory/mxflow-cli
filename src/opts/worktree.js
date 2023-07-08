import { stringInput, autocompleteInput } from "../core/prompts.js";

class Worktree {
  async select() {
    const { stdout } = await $`git worktree list`;
    const list = stdout
      .split("\n")
      .map((x) => x.split(" "))
      .reduce((acc, [cur]) => {
        acc.push(cur);
        return acc;
      }, []);
    const { worktree } = await autocompleteInput("worktree", list);
    return worktree;
  }

  async add() {
    const { branchName } = await stringInput("branchName", { value: "test" });
    const { path } = await stringInput("path", { value: `./${branchName}` });
    $$([`git worktree add -b ${branchName} ${path}`]);
  }

  async list() {
    const worktree = await this.select();
    L.warn(worktree);
    await cd(worktree);
    await $$`git status --short`;
  }

  async remove() {
    const worktree = await this.select();
    L.warn(worktree);
    $$([`git worktree remove ${worktree}`]);
  }
}

export default async () => {
  head(import.meta);

  const worktree = new Worktree();

  const { action } = await autocompleteInput("action", [
    "list",
    "add",
    "remove",
  ]);

  await worktree[action]();
};

// async function pickWorktree() { }
