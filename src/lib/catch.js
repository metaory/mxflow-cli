import Ajv from "ajv";
import { checkBranchExists, checkDirty } from "./git.js";
import Config from "./config.js";
const ajv = new Ajv({ allowUnionTypes: true });

export async function catchNoGit() {
  try {
    await $`git rev-parse --is-inside-work-tree`;
    return true;
  } catch (error) {
    info(error);
    L.error("not inside a git worktree");
  }
}

export async function catchDirtyGit() {
  if ((await checkDirty()) === true) {
    await $`git status --short`;
    L.error(
      "worktree is dirty\n" +
        "stash your changes before continuing.\n" +
        C.yellow("git stash push"),
    );
  }
  log.pass(CWD, "directory is clean!");
  log.greyDim(fillFrom("━"));
}

export async function catchOldConfig(config) {
  const [, pkgMinorVersion] = PKG_VERSION.split(".");
  const [, cfgMinorVersion] = (config.version || "").split(".");
  const oldConfig = "version" in config === false;
  const minorVersionMissmatch =
    cfgMinorVersion && pkgMinorVersion !== cfgMinorVersion;

  if (oldConfig || minorVersionMissmatch) {
    await Config.remove();
    log.grey("you may run the cli again\n");
    L.error(
      `different version\nminor ${PKG_VERSION} (${C.bold.yellow(
        config.version,
      )})`,
    );
  }
}

export async function catchBranchExist(branchName) {
  const branchExists = await checkBranchExists(branchName);
  if (branchExists) {
    L.error(`Branch name exists: ${C.bold(branchName)}`);
  }
}

export function catchConfigSchema(config) {
  const properties = Object.keys(config.workflows || {}).reduce((acc, cur) => {
    acc[cur] = {
      type: "object",
      required: ["steps", "description"],
      properties: {
        description: { type: "string" },
        steps: { type: "array", items: { type: ["string", "object"] } },
      },
    };
    return acc;
  }, {});

  const schema = {
    type: "object",
    properties: {
      version: { type: "string" },
      exit_on_error: { type: "boolean" },
      sleep: { type: "integer" },
      workflows: { type: "object", properties },
    },
    required: ["version", "workflows"],
    additionalProperties: false,
  };

  ajv.validate(schema, config);

  if (ajv.errors) {
    const [
      {
        message,
        instancePath,
        params: { additionalProperty = "" },
      },
    ] = ajv.errors;
    L.error(
      `config ${C.dim(instancePath)} ${message} ${C.yellow(
        additionalProperty,
      )}`,
    );
  }
}
