import pupa from "pupa";
import clipboard from "clipboardy";
import { spawnInteractively } from "../core/execution.js";

export async function getCurrentBranch() {
  const { stdout } = await $`git rev-parse --abbrev-ref HEAD || true`;
  return stdout.replace(/[\r\n]/gm, "");
}

export async function checkBranchExists(branchName) {
  try {
    await $`git rev-parse --verify ${branchName}`;
    return true;
  } catch (error) {
    info(error);
    return false;
  }
}

export async function checkDirty() {
  try {
    await $`git diff --quiet`;
    return false;
  } catch (error) {
    info(error);
    return true;
  }
}

export async function checkConflict(currentBranch, targetBranch) {
  console.info(
    C.grey("comparing"),
    C.blue(currentBranch),
    C.grey("..."),
    C.cyan(targetBranch)
  );
  try {
    await $`git reset --hard HEAD`;
    await $`git merge -Xignore-space-change --no-commit --no-ff origin/${targetBranch}`;
    await $`git reset --hard HEAD`;
    return { targetBranch, conflict: false };
  } catch (error) {
    info(targetBranch, error);
    await $`git merge --abort || true`;
    await $`git reset --hard HEAD`;
    return { targetBranch, conflict: true };
  }
}

export async function listRemoteBranches() {
  const { stdout } = await $`git branch -r`;
  return stdout
    .split("\n")
    .filter((x) => x)
    .map((x) => x.trim());
}

export async function listLatestLogs({ limit }) {
  head(import.meta, limit);
  log.info(`press ${C.bold.red("(q)")} to quit logs\n`);
  await sleep(2000);

  return spawnInteractively("git", [
    "log",
    "--graph",
    "--pretty='%Cred%h%Creset " +
      "-%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset'",
    `-${limit}`,
  ]);
}

export function logBugTrackerUrl(data) {
  info({ data });

  function getUrl() {
    switch (data.bugTrackerName) {
      case "jira":
        return `https://${data.bugTrackerTenant}.atlassian.net/browse/{taskId}`;
      case "clickup":
        return `https://app.clickup.com/t/${data.bugTrackerTenant}/{taskId}`;
      default:
        return "NA";
    }
  }
  if (data.taskId) {
    const url = pupa(getUrl(), data);
    clipboard.writeSync(url);
    log.greenBox(url, { title: "bug tracker" });
    L.loading("link", "copied to clipboard");
  }
}
