import {
  getCurrentBranch,
  checkConflict,
  listRemoteBranches,
} from "../lib/git.js";
import { stringInput, autocompleteInput } from "../core/prompts.js";
import { getBranchFormat } from "./checkout.js";

import { spawn } from "node:child_process";
const memoize = {};

export default async function conflictDetection(
  _trunkBranchName,
  fetch = true
) {
  head(import.meta, _trunkBranchName);
  L.warn("exprimental");

  log.cyanDim("Running Conflict Detection in:");
  log.yellowDim(CWD);
  log.grey(fillTo(CWD));

  fetch && (await $$`git fetch origin`);

  const { trunkBranchName } = await getTrunkBranchName(_trunkBranchName);

  const branches = await listRemoteBranches();

  await cache(branches, trunkBranchName);

  const branch = await getBranch(trunkBranchName);

  if (branch === "[Scan Again]") {
    return conflictDetection(_trunkBranchName, fetch);
  }

  await $`git merge --no-commit --no-ff ${branch} || true`;

  spawn("git", ["diff", "--diff-filter=U", "--relative"], {
    stdio: [process.stdin, process.stdout, process.stderr],
  }).on("close", () => {
    $`git merge --abort`;
    conflictDetection(trunkBranchName, false);
  });
}

// ------------

const getTrunkBranchName = (value = "flight") =>
  stringInput("trunkBranchName", {
    message: "enter search pattern",
    value,
  });

const cache = async (branches, trunkBranchName) => {
  const currentBranch = await getCurrentBranch();

  const trunks = branches
    .filter((x) => x.includes(trunkBranchName))
    .filter((x) => x !== currentBranch);

  info({ trunks });

  if (!memoize[trunkBranchName]) {
    memoize[trunkBranchName] = [];
    for (const trunk of trunks) {
      const status = await checkConflict(currentBranch, trunk);
      memoize[trunkBranchName].push(status);
    }
  }
};

const getBranch = (trunkBranchName) => {
  const conflictingBranches = memoize[trunkBranchName]
    .filter((x) => x.conflict === true)
    .map((x) => x.targetBranch);
  const conflictingBranchesFormat = getBranchFormat(
    conflictingBranches,
    trunkBranchName
  );

  log.yellowBox(`${conflictingBranches.length} Conflicting Branch Found!`);

  return autocompleteInput("branch", [
    ...conflictingBranchesFormat,
    "[Scan Again]",
  ]);
};
