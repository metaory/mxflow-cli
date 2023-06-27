import Prompt from "enquirer";
const enquirer = new Prompt();

export const multiselectInput = (name, choices, message, initial) =>
  enquirer.prompt({
    type: "multiselect",
    name,
    limit: 10,
    hint: "(Use <space> to select, <return> to submit)",
    initial,
    message,
    choices,
  });

export const autocompleteInput = (name, choices, message = `select ${C.bold(name)}`, initial = "") =>
  enquirer.prompt({ type: "autocomplete", name, limit: 10, initial, message, choices });

export const confirmInput = (name, message = "Are you sure?", initial = false) =>
  argv.force ?? argv.F
    ? { [name]: true }
    : enquirer.prompt({ type: "confirm", hint: `(${name})`, initial, name, message });

export const numberInput = (name, { message = `enter ${C.bold(name)}`, hint = "", value = 0, min = 1 } = {}) =>
  enquirer.prompt({
    type: "input",
    name,
    hint,
    result: (val) => Number(val),
    message,
    default: value,
    validate: (val) => {
      if (!val) {
        return `${name} cant be empty!`;
      }
      if (isNaN(val)) {
        return `${name} have to be number`;
      }
      if (val < min) {
        return `${name} have to be greater than ${min}`;
      }
      return true;
    },
  });

export const stringInput = (
  name,
  { message = `enter ${C.bold(name)}`, value = `${name}-placeholder`, hint, spaceReplacer = "-" } = {},
) =>
  enquirer.prompt({
    type: "input",
    name,
    hint,
    result: (val) => val.trim().replaceAll(" ", spaceReplacer),
    message,
    default: value,
    validate: (val) => !!val || `${name} cant be empty!`,
  });

export const promptWorkflow = async(branchTypes) => {
  const format = branchTypes.map((name) => {
    const message = `${C.blue.bold(name)} - ${cfg.workflows[name].description}`;
    return {
      name,
      message,
    };
  });
  const { workflow } = await autocompleteInput("workflow", format);
  return workflow;
};

export const promptArgs = async(workflow, args = []) => {
  const inputs = {
    string: stringInput,
    number: numberInput,
  };
  const output = {
    workflow,
  };

  for (const arg of args) {
    const argValue = argv[arg.name];
    if (argValue && arg.regex && !argv._.includes("trigger")) {
      const re = new RegExp(arg.regex);
      if (re.test(argValue) === false) {
        L.error(`${argValue} validation failed ${C.yellow(arg.regex)}`);
      }
    }

    if (argValue) {
      output[arg.export ?? arg.name] = argValue;
      continue;
    }

    if (arg.type === "string") {
      const { [arg.name]: res } = await inputs[arg.type](arg.name);
      output[arg.export ?? arg.name] = res ?? arg.default;
    }

    if (arg.type === "env") {
      output[arg.export ?? arg.name] = process.env[arg.name] ?? arg.default;
    }
  }

  return output;
};

// export const toggleInput = (name, { message = `select ${C.bold(name)}`, enabled, disabled, hint, initial }) =>
//   enquirer.prompt({ type: "toggle", initial, hint, enabled, disabled, name, message });

// export const listInput = (name, choices, message = `select ${C.bold(name)}`) =>
//   enquirer.prompt({ type: "select", name, message, limit: 7, choices });
