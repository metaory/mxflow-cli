import { catchNoGit, catchDirtyGit } from "../catch.js";

const Checks = { catchNoGit, catchDirtyGit };

export default async (checks) => {
  const checkMap = { "git-clean": ["catchNoGit", "catchDirtyGit"] };
  const possibleChecks = Object.keys(checkMap);
  for (const check of checks) {
    const checkMark = Array.from({ length: check.length }).fill("^").join("");

    if (possibleChecks.includes(check) === false) {
      L.warn(`check: '${check}' is not implemented
               ${checkMark}`);
      continue;
    }
    L.loading("check running", check);
    const functions = checkMap[check];
    for (const fn of functions) {
      await Checks[fn]();
    }
    await $`sleep 1`;
  }
  L.info("checks", "are done");
};
