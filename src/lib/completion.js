import findFile from "simple-find-file-recursively-up";
import omelette from "omelette";
import fs from "fs";
import YAML from "yaml";

const MXF_MAX_ARGS = process.env.MXF_MAX_ARGS ?? 10;

const getConfig = () => {
  const configPath = findFile(".mxflow/config.yml");
  if (!configPath) {
    return false;
  }
  return fs.readFileSync(configPath, "utf8");
};

const workflows = () =>
  getConfig()
    ? Object.keys(YAML.parse(getConfig()).workflows).sort()
    : ["CONFIG_NOT_FOUND"];

const args = (workflow) => {
  const args = YAML.parse(getConfig()).workflows[workflow].args ?? [];
  return [...args, { name: "force" }, { name: "verbose" }].map(
    (x) => `--${x.name}`
  );
};

const completion = omelette(
  `mxflow|mxf <action> <workflow> ${"<arg> <val> ".repeat(MXF_MAX_ARGS)}<flags>`
);

completion.on("action", ({ reply }) => {
  reply([
    "trigger",
    "init",
    "version",
    "reset",
    "help",
    "--force",
    "--verbose",
    "--setup-completion",
    "--clean-completion",
  ]);
});
completion.on("flags", ({ reply, line }) => {
  reply(["--verbose", "--force"].filter((x) => !line.includes(x)));
});

completion.on("workflow", ({ before, reply }) => {
  reply(before === "trigger" ? workflows() : []);
});

completion.on("arg", ({ reply, line }) => {
  const [, , workflow] = line.split(" ");
  reply(args(workflow).filter((x) => !line.includes(x)));
});

completion.on("val", ({ reply }) => {
  reply([""]);
});
completion.init();

switch (process.argv[2]) {
  case "--setup-completion":
    L.warn("setting up shell completion");
    completion.setupShellInitFile();
    break;
  case "--clean-completion":
    L.warn("cleaning up up shell completion");
    completion.cleanupShellInitFile();
    break;
}
