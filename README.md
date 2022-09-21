# hgit
### :rocket: a beautiful unopinionated config based workflow **engine**
# Streamline and Simplify complex git processes

<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/2022-09-20-003715_1026x1000_scrot.png">
</p>

---

![hgit v0.42.1-2](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220920203311.gif)

<!-- ![hgit v0.32.5-0](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220916124849.gif) -->
<!-- ![hgit v0.32.3](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220916123031.gif) -->

# Sample Config

<details>
  <summary>sample-generated-config-file</summary>


  ```yaml
  config_version: 0.42.0
  trunk_branch_name: flight
  sleep_between_commands: 3000
  graph_git_log_limit: 40
  bug_tracker_path: https://app.clickup.com/t/14288054/{taskId}
  workflows:
    flight__branch_pattern: flight/{description}
    flight:
      - git fetch origin
      - git checkout master
      - git merge origin/master
      - confirm git fetch --all
      - git checkout -b {branchName}
      - git status
      - confirm git push --set-upstream origin {branchName}
      - list logs
    feature__branch_pattern: '{branchType}/{taskId}-{description}'
    feature:
      - git fetch origin
      - git checkout master
      - git merge origin/master
      - confirm git fetch origin
      - autocomplete checkout flight
      - git checkout -b {branchName}
      - git status
      - confirm git push --set-upstream origin {branchName}
      - list logs
    bugfix__branch_pattern: '{branchType}/{taskId}-{description}'
    bugfix:
      - git fetch origin
      - git checkout master
      - git merge origin/master
      - confirm git fetch origin
      - autocomplete checkout flight
      - git checkout -b {branchName}
      - git status
      - confirm git push --set-upstream origin {branchName}
      - list logs
    other__branch_pattern: '{branchType}/{taskId}-{description}'
    other:
      - git fetch origin
      - git checkout master
      - git merge origin/master
      - confirm git fetch origin
      - autocomplete checkout flight
      - git checkout -b {branchName}
      - git status
      - confirm git push --set-upstream origin {branchName}
      - list logs
    hotfix__branch_pattern: '{branchType}/{taskId}-{description}'
    hotfix:
      - git fetch origin
      - git checkout master
      - git merge origin/master
      - confirm git fetch --all
      - git checkout -b {branchName}
      - git status
      - confirm git push --set-upstream origin {branchName}
      - list logs
  ```
</details>

[sample-git-workflow](https://github.com/metaory/hgit-cli/wiki/Git-Workflow-Sample)

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
- **ALL** commands are read from the config file in `~/.config/hgit/config.yml`
- `dynamic branch checkout` in workflows with command: `prompt_checkout__{pattern}`
- `branchNamePattern` from config: `{branchType}__branch_pattern`
- add `confirm__` to commands for a confirmation prompt before the command 

---

npx
===
    npx hgit

Installation
============
    npm i -g hgit

Usage
=====
    hgit

Options
=======
    --verbose               | verbose logs

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
<!-- ![hgit v0.30.1-1](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220914224723.gif) -->
<!-- --- -->
<!-- ![hgit v0.30.1-1](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220914223020.gif) -->
<!-- --- -->
<!-- ![hgit v0.27.2](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220913235153.gif) -->
