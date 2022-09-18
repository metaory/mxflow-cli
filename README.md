# hgit
### :rocket: an unopinionated git workflow cli tool

# Streamline and Simplify complex git processes

<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/2022-09-17-180241_876x974_scrot.png">
</p>

---

![hgit v0.36.10](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220917181546.gif)

<!-- ![hgit v0.32.5-0](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220916124849.gif) -->
<!-- ![hgit v0.32.3](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220916123031.gif) -->

# Sample Config

<details>
  <summary>sample-generated-config-file</summary>

  <h5><a href="https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/sample-generated-config.json">sample</a></h5>


  ```json
  {
    "config_version": "0.37.1",
    "trunk_branch_name": "xorg",
    "sleep_between_commands": 3000,
    "graph_git_log_limit": 40,
    "bug_tracker_path": "https://metaory.atlassian.net/browse/{taskId}",
    "commands": {
      "git_push_origin": "git push --set-upstream origin {branchName}",
      "git_checkout_branch": "git checkout {branchName}",
      "git_create_branch": "git checkout -b {branchName}",
      "git_fetch_origin": "git fetch origin",
      "git_checkout_dev": "git checkout dev",
      "git_merge_dev": "git merge origin/dev",
      "git_checkout_master": "git checkout master",
      "git_merge_master": "git merge origin/master",
      "git_is_inside_worktree": "git rev-parse --is-inside-work-tree",
      "git_prune": "git gc --prune=now && git remote prune origin",
      "git_reset_master": "git reset --hard master",
      "git_reset_head": "git reset --hard HEAD~1",
      "git_merge_abort": "git merge --abort || true",
      "git_is_dirty": "git status --short",
      "git_status": "git status",
      "git_workflow_add": "git worktree add -b {branchName} {path} {origin}",
      "git_workflow_list": "git worktree list"
    },
    "checkout": [
      "git_fetch_origin",
      "git_checkout_branch",
      "git_status"
    ],
    "start_workflow": {
      "xorg__branch_pattern": "xorg/{description}",
      "xorg": [
        "git_fetch_origin",
        "git_checkout_master",
        "git_merge_master",
        "git_create_branch",
        "git_status"
      ],
      "feature__branch_pattern": "{branchType}/{taskId}-{description}",
      "feature": [
        "git_fetch_origin",
        "git_checkout_master",
        "git_merge_master",
        "prompt_checkout__xorg",
        "git_create_branch",
        "git_status"
      ],
      "foo__branch_pattern": "{branchType}/{taskId}-{description}",
      "foo": [
        "git_fetch_origin",
        "git_checkout_master",
        "git_merge_master",
        "prompt_checkout__xorg",
        "git_create_branch",
        "git_status"
      ],
      "bar__branch_pattern": "{branchType}/{taskId}-{description}",
      "bar": [
        "git_fetch_origin",
        "git_checkout_master",
        "git_merge_master",
        "git_create_branch",
        "git_status"
      ]
    }
  }

  ```
</details>

---

Features
========
- check for `conflict` between multiple remote branch
- start new workflows from a `config` file 
- **ALL** commands are read from the config file in `~/.config/hgit/config.json`
- `dynamic branch checkout` in workflows with command: `prompt_checkout__{pattern}`
- `branchNamePattern` from config: `{branchType}__branch_pattern`

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

<!-- --- -->
<!---->
<!-- ![hgit v0.30.1-1](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220914224723.gif) -->
<!-- --- -->
<!-- ![hgit v0.30.1-1](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220914223020.gif) -->
<!-- --- -->
<!-- ![hgit v0.27.2](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220913235153.gif) -->
