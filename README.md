# hgit
a git workflow cli tool

# Streamline and Simplify complex git processes

<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/hgit.png">
</p>

---

![hgit 0.19.1](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220902160438.gif)

TL;DR
=====

**Hotfix branch:**

- Can only be created from `master`
- While branch in active, can sync from `master`
- Cannot take pull from `dev`
- Should not take pull from another `feature / flight / hotfix` branch

**Flight branch:**

- Will only be created from `master`
- Can sync from `master`
- Cannot sync from `dev`

**Task/bugfix in Flight (Child branch -> Flight branch):**

- Task branch should be created from the `Flight` branch
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

---

Features
========
- check for conflict between multiple remote branch
- start new workflow with `__pre` and `__post` commands are read from config file
- \*all git commands are read from the config file `~/.config/hgit/config.json`
- dynamic branch checkout in workflows with command: `git_pick_{pattern}`
- `branchNamePattern` from config: `{branchName}__branch_pattern`

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

