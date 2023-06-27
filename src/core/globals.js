import "zx/globals";
import boxen from "boxen";
import ora from "ora";
import pupa from "pupa";
import * as L from "prettycli";
import { highlight } from "cli-highlight";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";
import { catchConfigSchema, catchOldConfig } from "../lib/catch.js";
import checkoutBranch from "../opts/checkout.js";
import { confirmInput } from "./prompts.js";
import {
  getCurrentBranch,
  listLatestLogs,
  logBugTrackerUrl,
} from "../lib/git.js";
import Config from "../lib/config.js";

const {
  stdout: { columns },
} = process;

dotenv.config();
$.verbose = argv.verbose ?? argv.v ?? false;
// $.prefix = 'set -euo pipefail;'

const spinner = ora();
const history = [];
const historyStatus = [];
const startTime = Date.now();

const replaceHome = (str = process.cwd()) => str.replace(os.homedir(), "~");

global.ICON = {
  PASS: "✔",
  FAIL: "✖",
  INFO: "ℹ",
  WARN: "⚠",
  VERT: "┃ ",
  HORZ: "╸",
  TREE: "⇄",
  WORKFLOW: "●",
  CHECKOUT: "◀",
  CONFLICT: "▲",
};
global.spinner = spinner;
global.C = chalk;
global.L = L;
global.PKG_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../package.json",
);

const { name, version } = await fs.readJson(PKG_PATH);

global.PKG_NAME = name;
global.PKG_VERSION = version;
global.CWD = replaceHome();

if (argv.version || argv._.includes("version")) {
  process.stdout.write(`${PKG_VERSION}\n`);
  process.exit();
}

const getModuleName = (url) => {
  const [[moduleName]] = fileURLToPath(url)
    .split("/")
    .map((x) => x.split("."))
    .reverse();
  return moduleName;
};

global.head = ({ url }, etc = "-") =>
  L.info(
    getModuleName(url),
    `module loaded  ⌜${C.yellow(replaceHome(String(etc)))}⌝`,
  ); // ⌞⌟ ⌜⌝

global.info = (msg, etc) => $.verbose && console.info(msg, etc);

const logTitle = () => {
  const title = `${C.blue.dim("STEP")} ${C.blue(history.length)}\n`;
  process.stdout.write(fillFrom(" ", columns / 3) + title);
};

const globalContext = { ...process.env };

const logOutput = ({ stdout, stderr }) => {
  const formatOut = (str, color) =>
    str
      .split("\n")
      .filter((x) => x)
      .map((x) => C[color].bold(global.ICON.VERT) + x)
      .join("\n");
  stdout && log.greenDim(formatOut(stdout, "green"));
  stderr && log.redDim(formatOut(stderr, "red"));
};

global.$$ = async function ex(commands = [], data = {}) {
  const currentBranch = await getCurrentBranch();

  const context = {
    ...globalContext,
    "current-branch": currentBranch,
    ...data,
  };
  for (const cmd of commands) {
    // Special commands
    if (typeof cmd === "object") {
      const [key] = Object.keys(cmd);
      switch (key) {
      case "log-bugtracker":
        logBugTrackerUrl(data, cmd[key]);
        break;
      case "checkout-branch":
        globalContext[cmd[key].export ?? "branch"] = await checkoutBranch(
          cmd[key],
        );
        break;
      case "list-logs":
        await listLatestLogs(cmd[key]);
        break;
      }
      historyStatus.push(C.yellow(global.ICON.INFO));
      history.push(key);
      continue;
    }

    // Changes the current working directory
    if (cmd.startsWith("cd")) {
      const [, path] = cmd.split(" ");
      const resolved = pupa(path, context);
      cd(resolved);
      historyStatus.push(C.yellow(global.ICON.INFO));
      history.push(resolved);
      continue;
    }

    // Confirmation step
    const [type, ...action] = cmd.split(" ");
    if (type === "confirm") {
      const command = action.join(" ");
      const [program] = action;
      L.warn(`${C.yellow.dim("confirm")} ${command}`);
      const confirm = await confirmInput(program);
      if (confirm[program] === true) {
        await global.$$([command], context);
      }
      continue;
    }

    const parsedCmd = pupa(cmd, context, { ignoreMissing: true });
    history.push(parsedCmd);

    logTitle();

    $.verbose
      ? console.log(cmd)
      : spinner.start(C.yellow(cmd) + C.grey(`\n$ ${parsedCmd}\n`));

    try {
      if (!parsedCmd) throw new Error(`missing ${cmd}`);

      const output = await $([parsedCmd]);
      await sleep(cfg?.sleep ?? 1000); // XXX for no reason!!

      // spinner.succeed(cmd)
      spinner.stop(cmd);
      log.green(`${global.ICON.VERT}${global.ICON.PASS} ${C.reset.bold(cmd)}`);

      logOutput(output);
      historyStatus.push(C.green(global.ICON.PASS));
    } catch (err) {
      historyStatus.push(C.red(global.ICON.FAIL));
      // spinner.fail(cmd)
      spinner.stop(cmd);
      log.red(`${global.ICON.VERT}${global.ICON.FAIL} ${C.reset.bold(cmd)}`);
      info(err);

      logOutput(err);

      if (err.exitCode !== 0 && cfg.exit_on_error) {
        L.error(err.stderr || err.stdout);
      }
    } finally {
      log.grey(fillFrom(global.ICON.HORZ));
    }
  }
};
process.on("exit", () => {
  process.stdout.write("\n\n");
  L.loading("history", history.length);
  history.forEach((_, i) =>
    process.stdout.write(
      " ".repeat(4) +
        historyStatus[i] +
        " ".repeat(1) +
        C.blue(history[i]) +
        "\n",
    ),
  );
  process.stdout.write("\n");
  const took = ((Date.now() - startTime) / 1000).toFixed(1);
  L.info("done", `took ${took}s`);
});

global.fillFrom = (char = "x", length = columns) =>
  Array.from({ length })
    .map(() => char)
    .join("");

global.fillTo = (str) =>
  Array.from(str)
    .map(() => global.ICON.HORZ)
    .join("");

global.newLine = () => process.stdout.write("\n");

global.logYaml = (str, ignoreIllegals = true) => {
  const theme = { string: C.blue, attr: C.cyan.bold };
  const language = "yaml";
  global.newLine();
  process.stdout.write(highlight(str, { theme, language, ignoreIllegals }));
  global.newLine();
};

const _log = (txt, color, mode = "reset") =>
  process.stdout.write(C[mode][color](txt) + "\n");
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color);
const _upp = (str) => str.charAt(0).toUpperCase() + str.substr(1, str.length);
global.log = [
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "grey",
].reduce(
  (acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur);
    acc[`${cur}Sat`] = (txt) => _log(txt, `${cur}Bright`);
    acc[`${cur}Dim`] = (txt) => _log(txt, cur, "dim");
    acc[`bg${_upp(cur)}`] = (txt) => _log(C.black.bold(txt), `bg${_upp(cur)}`);
    acc[`${cur}Box`] = (
      txt,
      {
        title,
        padding = 1,
        borderStyle = cur === "red" ? "double" : "bold",
      } = {},
    ) => _box(txt, cur, { title, padding, borderStyle });

    return acc;
  },
  {
    pass: (txt, etc = "") =>
      _log(`${global.ICON.PASS} ${C.blue(replaceHome(txt))} ${etc}`, "green"),
    info: (txt, etc = "") =>
      _log(`${global.ICON.INFO} ${C.magenta(txt)} ${etc}`, "cyan"),
    warn: (txt, etc = "") =>
      _log(`${global.ICON.WARN} ${C.yellowBright(txt)} ${etc}`, "yellow"),
    fail: (txt, etc = "") =>
      _log(`${global.ICON.FAIL} ${C.redBright(txt)} ${etc}`, "red"),
    fatal: (txt, etc = "", title = CWD) => {
      const icon = C.redBright(global.ICON.FAIL);
      log.redBox(`${icon} ${txt} ${C.redBright(etc)}`, { title });
      process.exit(1);
    },
  },
);

let _config;
Object.defineProperty(global, "cfg", {
  get: () => _config,
  set: (val) => {
    val.sleep = Number(process.env.MXF_SLEEP ?? argv.sleep ?? val.sleep ?? 1000);
    $.verbose &&
      L.warn(
        `sleep ${C.yellow.dim("is set to")} ${C.bold(
          (val.sleep / 1000).toFixed(1),
        )}s`,
      );
    catchConfigSchema(val);
    catchOldConfig(val);
    info(JSON.stringify(val, null, 2), C.yellow(val.version));
    _config = val;
  },
  configurable: true,
});

global.cfg = await new Config().init();
