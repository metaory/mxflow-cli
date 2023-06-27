import { getCurrentBranch, listRemoteBranches } from "../lib/git.js";
import { autocompleteInput } from "../core/prompts.js";

// -------------------

export default async({ base, checkout = true }) => {
  head(import.meta, base);

  const branches = await getBranches(base);

  const { branchName } = await getBranchName(branches, base);

  checkout && (await $$([`git checkout ${branchName}`]));

  return branchName;
};

// -------------------
const getBranchName = async(branches, query) => {
  const currentBranch = await getCurrentBranch();
  const initial = "origin/" + currentBranch;

  return autocompleteInput("branchName", getBranchFormat(branches, query), "select base branch", initial);
};
export const getBranchFormat = (branches, query = "") =>
  branches.map((name) => {
    const message = name.replace("origin/", C.dim("origin/")).replace(query, C.yellow.dim(query));
    return { name, message };
  });

const getBranches = async(query) => {
  const remoteBranches = await listRemoteBranches();
  const branches = remoteBranches.filter((x) => x.includes(query));
  if (!branches.length) {
    log.grey(`create and push ${C.yellow.bold(query)} first.`);
    log.fatal("no remote branch for", "origin/" + query);
  }
  return branches;
};
