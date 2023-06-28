import pupa from "pupa";
import checkoutBranch from "../opts/checkout.js";
import { confirmInput } from "./prompts.js";
import {
  getCurrentBranch,
  listLatestLogs,
  logBugTrackerUrl,
} from "../lib/git.js";

const startTime = Date.now();
const history = [];
const historyStatus = [];
const {
  stdout: { columns },
} = process;

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

const currentBranch = await getCurrentBranch();

export async function exec(commands = [], data = {}) {
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
            cmd[key]
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
}

process.on("exit", () => {
  process.stdout.write("\n\n");
  L.loading("history", history.length);
  history.forEach((_, i) =>
    process.stdout.write(
      " ".repeat(4) +
        historyStatus[i] +
        " ".repeat(1) +
        C.blue(history[i]) +
        "\n"
    )
  );
  process.stdout.write("\n");
  const took = ((Date.now() - startTime) / 1000).toFixed(1);
  L.info("done", `took ${took}s`);
});

global.$$ = exec;
