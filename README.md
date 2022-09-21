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
- **ALL** commands are read from the config file in `~/.config/hgit/config.json`
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

---

TL;DR
=====

## The Default configs

| branch  | create from | can sync from | branch name                      |
| ---     | ---         | ---           | ---                              |
| flight  | master      | master        | `flight/{description}`           |
| hotfix  | master      | master        | `hotfix/{taskId}-{description}`  |
| feature | flight      | parent flight | `feature/{taskId}-{description}` |
| bugfix  | flight      | parent flight | `bugfix/{taskId}-{description}`  |
| other   | flight      | parent flight | `other/{taskId}-{description}`   |


**Hotfix branch:**

- Can only be created from `master`
- While branch in active, can sync from `master`
- Cannot take pull from `dev`
- Should not take pull from another `feature / flight / hotfix` branch

**Flight branch:**

- Will only be created from `master`
- Can sync from `master`
- Cannot sync from `dev`

**feature/bugfix/other in Flight (Child branch -> Flight branch):**

- Task branches (feature/bugfix/other) should be created from the `Flight` branch
- Cannot take pull from any branch but `Flight` branch
- Can take pull from a sibling branch of the **same flight** if it depends on it

---

### Flights(trunk)
- **flight** is for the **features**, **bugs**, and **improvements** corresponding to the **flight** (epic) in the _`BugTracking system`_
- **Ticket branches** can be created from a **flight** branch.
- There are 3 **ticket branch** prefixes: **feature**, **bugfix**, and **other**. _These branches require a `BugTracking task ID` in their names._

1. `feature` is for the small packed **features** inside the flight.
2. `bugfix` is for the **fixes** and **issues** related to the flight.
3. `other` is used for **non-technical** issues like documentation or infrastructure improvements, etc.

### Hotfix
- **hotfix** is dedicated to fixes regarding **critical issues** in the production environment.

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
