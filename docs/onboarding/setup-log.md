# PREIshare setup log

**Learner:** Alexis Terry
**Date:** 2026-09-08
**OS:** Windows (PowerShell); Git 2.55.0.windows.3
**Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
**Orientation notes used:** `docs/onboarding/team-orientation-notes.md`

## 1. Accounts and fork

| Check | Result | Notes |
| --- | --- | --- |
| GitHub sign-in works | PASS | Account username: @aterry04 |
| Can view team repo https://github.com/EdTechForLearning/PREIShare-org-repo | PASS | Team repository of record confirmed |
| Fork created in my account | PASS | My fork URL: https://github.com/aterry04/PREIShare-org-repo |

## 2. Git install and identity

```text
PS C:\Windows\system32> git --version
git version 2.55.0.windows.3

PS C:\Windows\system32> git config --global user.name "Alexis Terry"
PS C:\Windows\system32> git config --global user.email "alexisterry801@gmail.com"
PS C:\Windows\system32> git config --global --list
user.name=Alexis Terry
user.email=alexisterry801@gmail.com
```

Identity configured: PASS

## 3. Clone (of MY fork)

- Parent directory used: `C:\users\act07\documents\projects`
- Clone command used: `git clone https://github.com/aterry04/PREIShare-org-repo.git`
- Cloned my fork (not the team repo): PASS
- Clone completed without error: PASS
- Local project path: `C:\users\act07\documents\projects\PREIShare-org-repo`

```text
PS C:\users\act07\documents\projects> git clone https://github.com/aterry04/PREIShare-org-repo.git
Cloning into 'PREIShare-org-repo'...
remote: Enumerating objects: 41, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (5/5), done.
remote: Total 41 (delta 3), reused 0 (delta 0), pack-reused 36 (from 1)
Receiving objects: 100% (41/41), 49.76 KiB | 606.00 KiB/s, done.
Resolving deltas: 100% (6/6), done.
```

## 4. Remotes (run inside the repo)

- `git remote add upstream https://github.com/EdTechForLearning/PREIShare-org-repo.git` run: PASS

First run printed no error (Git only prints when add fails). A second add was typed afterward; `git remote -v` still shows the correct upstream URL, so the remote is in place.

### git remote -v

```text
PS C:\users\act07\documents\projects\PREIShare-org-repo> git remote -v
origin  https://github.com/aterry04/PREIShare-org-repo.git (fetch)
origin  https://github.com/aterry04/PREIShare-org-repo.git (push)
upstream        https://github.com/EdTechForLearning/PREIShare-org-repo.git (fetch)
upstream        https://github.com/EdTechForLearning/PREIShare-org-repo.git (push)
```

origin points at MY fork: PASS
upstream points at the team repo: PASS

## 5. Post-clone verification

### git status

```text
PS C:\users\act07\documents\projects\PREIShare-org-repo> git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Default branch

```text
PS C:\users\act07\documents\projects\PREIShare-org-repo> git branch --show-current
main
```

Default branch name: `main`
Working tree clean after clone: PASS

## 6. Auth notes (no secrets)

- Clone method: HTTPS
- Auth method used (if prompted): none shown (public HTTPS clone completed without a credential prompt in the captured output)
- Auth succeeded: PASS
- **Do not paste tokens or private keys here**

## 7. Issues and fixes

| Issue | What I tried | Outcome |
| --- | --- | --- |
| Ran `git remote add upstream` a second time | Continued and ran `git remote -v` | Four remotes lines are correct; origin is my fork, upstream is the team repo. If the second add printed “remote upstream already exists,” that is expected and not a failure. |

## 8. Ready for next step

I have a fork I own, a local clone of it with origin and upstream set, and a setup log another teammate could audit: YES
