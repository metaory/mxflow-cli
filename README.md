# mxflow
### :rocket: a beautiful unopinionated config based workflow **engine**
# Streamline and Simplify complex processes

## a CICD for local machines

<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/2022-09-22-213922_990x1046_scrot.png">
  <!-- <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/2022-09-20-003715_1026x1000_scrot.png"> -->
</p>

---

<!-- ![mxflow v0.47.1](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220922214148.gif) -->

![mxflow v0.47.15](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220923200431.gif)
<!-- ![mxflow v0.47.14](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220923195037.gif) -->
<!-- ![mxflow v0.47.13](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220923175552.gif) -->


<!-- ![mxflow v0.42.1-2](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220920203311.gif) -->

<!-- ![mxflow v0.32.5-0](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220916124849.gif) -->
<!-- ![mxflow v0.32.3](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220916123031.gif) -->

Requirements
============
- Node 16.x

# Sample Config

<details>
  <summary>sample-generated-config-file</summary>


  ```yaml
  config_version: 0.47.0
  graph_git_log_limit: 40
  issue_tracker: jira
  issue_tracker_tenant: metaory
  sleep_between_commands: 1000
  workflows:
    foo:
      description: example placeholder
      pattern: '{branchType}/{taskId}-{description}'
      steps:
        - git fetch origin
        - git checkout master
        - git merge origin/master
        - git checkout -b {branchName}
        - git status
        - confirm git push --set-upstream origin {branchName}
        - list logs
    bar:
      description: example placeholder
      branch: xorg/{description}
      steps:
        - git fetch origin
        - git checkout master
        - git merge origin/master
        - autocomplete checkout xorg
        - git checkout -b {branchName}
        - git status
        - confirm git push --set-upstream origin {branchName}
        - list logs
    xorg:
      description: example placeholder
      steps:
        - echo hello word
        - echo goodbye cruel world
        - confirm echo goodbye
  ```
</details>

[sample-git-workflow](https://github.com/metaory/mxflow-cli/wiki/Git-Workflow-Sample)

---
Config Behaviours
=================

### Special commands:
- `list logs` _list last n pretty graph log_
- `autocomplete checkout {pattern}` _prompt checkout the pattern branch_
- `confirm {commandName}` _adds confirmation step to command_

---

Features
========
- check for `conflict` between multiple remote branch
- start new workflows from a `config` file 
- **ALL** commands are read from the config file in `~/.config/mxflow/config.yml`
- `dynamic branch checkout` in workflows with command: `prompt_checkout__{pattern}`
- `branchNamePattern` from config: `{branchType}.branch_pattern`
- add `confirm ` to commands for a confirmation prompt before the command

---

npx
===
    npx mxflow

Installation
============
    npm i -g mxflow

Usage
=====
    mxflow
    mxflow --trigger foobar

Options
=======
    --verbose                 | verbose logs
    --trigger <workflow-name> | non-interactive workflow trigger

Roadmap
=======

- [X] project based config file
- [ ] plugin system for dynamic lists
- [ ] aurgument mode
- [ ] argument autocomplete

***

            ___           ___
           /__/\         /  /\        ___           ___
           \  \:\       /  /:/_      /  /\         /  /\
            \__\:\     /  /:/ /\    /  /:/        /  /:/
        ___ /  /::\   /  /:/_/::\  /__/::\       /  /:/
       /__/\  /:/\:\ /__/:/__\/\:\ \__\/\:\__   /  /::\
       \  \:\/:/__\/ \  \:\ /~~/:/    \  \:\/\ /__/:/\:\
        \  \::/       \  \:\  /:/      \__\::/ \__\/  \:\
         \  \:\        \  \:\/:/       /__/:/       \  \:\
          \  \:\        \  \::/        \__\/         \__\/
           \__\/         \__\/


<!---->
<!-- ![mxflow v0.30.1-1](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220914224723.gif) -->
<!-- --- -->
<!-- ![mxflow v0.30.1-1](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220914223020.gif) -->
<!-- --- -->
<!-- ![mxflow v0.27.2](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220913235153.gif) -->
