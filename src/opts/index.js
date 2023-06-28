import conflictDetection from "./conflictDetection.js";
import workflows from "../core/workflows.js";
import checkoutBranch from "./checkout.js";
import cherryPick from "./cherryPick.js";
import worktree from "./worktree.js";
import Config from "../lib/config.js";

const list = () => [
  // {
  //   name: 'startTicket',
  //   message: C.bold.magenta('◼ start new ticket workflow'),
  //   options: { collectType: true }
  // },
  // {
  //   name: 'startTrunk',
  //   message: C.bold.blue(`● start new ${cfg.trunk_branch_name} workflow`),
  //   options: { collectType: false }
  // },
  {
    name: "workflows",
    message: C.cyan(`${global.ICON.WORKFLOW} trigger workflow`),
  },
  {
    name: "checkoutBranch",
    message: C.magenta(`${global.ICON.CHECKOUT} checkout branch`),
    options: { base: "" },
  },
  {
    name: "conflictDetection",
    message: C.blue(`${global.ICON.CONFLICT} conflict detection`),
  },
  // {
  //   name: 'cherryPick',
  //   disabled: true,
  //   message: C.yellow('◈ cherry pick')
  // },
  {
    name: "worktree",
    message: C.green(`${global.ICON.TREE} worktree`), // ⭓
  },
  {
    name: "reset",
    message: C.red(`${global.ICON.FAIL} reset system config`),
  },
  // { name: 'cherryPick', message: 'interactive cherry pick', disabled: true },
  // { name: 'PR_toLanding', message: 'create pull request', disabled: true },
  // { name: 'install_husky_hook', message: 'install husky hook', disabled: true }
];
const reset = Config.reset;

export {
  conflictDetection,
  workflows,
  checkoutBranch,
  cherryPick,
  worktree,
  list,
  reset,
};
