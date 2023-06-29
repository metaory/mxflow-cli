import { stringInput, multiselectInput } from "../core/prompts.js";

export const basic = {
  exit_on_error: false,
  workflows: {
    foobar: {
      description: "example placeholder",
      checks: ["git-clean"],
      args: [
        { name: "foo", type: "string" },
        {
          name: "bar",
          type: "string",
          regex: "^bar+\\w",
          default: "bar bdef",
          export: "barx",
        },
      ],
      steps: [
        "echo hello {current-branch} {foo} world",
        "echo goodbye {foo} {barx} cruel world",
        "confirm echo {barx} goodbye",
        "echo 'AWS_PROFILE: {AWS_PROFILE}'",
      ],
    },
  },
};

export default async () => {
  const { base } = await stringInput("base", {
    value: "flight",
    message: "enter Trunk Branch name",
  });

  const branchTypes = await getBranchTypes();

  const { trunkBasedBranches } = await getTrunkBased(branchTypes, base);

  return {
    workflows: [base, ...branchTypes].reduce(
      (acc, cur) => ({
        ...acc,
        [`create-${cur}`]: {
          description: `create new ${cur} branch workflow`,
          args: [
            ...(cur === base ? [] : [{ name: "taskId", type: "string" }]),
            { name: "desc", type: "string" },
            // { name: 'MXF_BUG_TRACKER_NAME', type: 'env', default: 'jira', export: 'bugTrackerName' },
            // { name: 'MXF_BUG_TRACKER_TENANT', type: 'env', default: 'metaory', export: 'bugTrackerTenant' }
          ],
          steps: [
            "echo running {workflow}",
            "git fetch origin",
            "git checkout master",
            "git merge origin/master",
            ...(trunkBasedBranches.includes(cur)
              ? [{ "checkout-branch": { base } }]
              : []),
            `git checkout -b ${cur}/${
              cur === base ? "{desc}" : "{taskId}-{desc}"
            }`,
            "git status",
            `confirm git push -u ${cur}/${
              cur === base ? "{desc}" : "{taskId}-{desc}"
            }`,
            { "list-logs": { limit: 100 } },
            {
              "log-bugtracker": {
                bugtracker: "{MXF_BUG_TRACKER_NAME}",
                tenant: "{MXF_BUG_TRACKER_TENANT}",
              },
            },
          ],
        },
      }),
      {}
    ),
  };
}; // ^^^^^^^^ :(

async function getBranchTypes() {
  const { branch_types: branchTypesStr } = await stringInput("branch_types", {
    message: `comma separated ${C.bold("branch types")}`,
    value: "feature, bugfix, other, hotfix",
    spaceReplacer: " ",
  });

  return Object.freeze(
    branchTypesStr
      .split(",")
      .map((x) => x.trim())
      .map((x) => x.replaceAll(" ", "_"))
  );
}

const getTrunkBased = (branchTypes, trunkBranchName) =>
  multiselectInput(
    "trunkBasedBranches",
    [...branchTypes],
    `select ${C.bold("child branches")} for ${C.bold(trunkBranchName)}`,
    branchTypes.length > 3 ? [0, 1, 2] : 0
  );
