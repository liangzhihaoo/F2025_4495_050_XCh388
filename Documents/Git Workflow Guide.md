# Git Workflow Guide (Team Workflow)

> **Branch Strategy**
>
> - `master`: Production branch, always **deployable** (auto-deployed)  
> - `dev`: Integration branch; used to collect all feature work (no direct commits)  
> - `feature/*`: Feature branches (e.g., `feature/user-management`)  
> - `hotfix/*`: Urgent production fix branches  
>
> **Pull Request Rule**:  
> - Merging `feature/*` into `dev` does **not** require a pull request  
> - Merging `dev` into `master` **requires** a pull request on GitHub for review and approval  

---

## 0) Initial Setup (one-time)

- **Local machine**
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "you@example.com"
  git config --global core.autocrlf true   # recommended for Windows
  ```

- **On GitHub**
  - Ensure you have been added as a collaborator with push access.

- **Clone the repository**
  ```bash
  git clone <repository-url>
  cd <repo-directory>
  ```

---

## 1) Working on a Feature (merge to `dev` without pull request)

1. **Update your local `dev` branch**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create a new feature branch**
   ```bash
   git checkout -b feature/<feature-name>
   # Example: git checkout -b feature/user-management
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add user management"
   ```

4. **Push the feature branch (optional but recommended)**
   ```bash
   git push -u origin feature/<feature-name>
   ```

5. **Merge the feature branch into `dev` locally**
   ```bash
   # Switch back to dev and pull the latest
   git checkout dev
   git pull origin dev

   # Merge the feature branch into dev
   git merge feature/<feature-name>

   # If there are conflicts:
   #  - resolve them in your editor
   #  - then stage and continue
   git add <resolved-files>
   git commit   # completes the merge if needed

   # Push the updated dev branch
   git push origin dev
   ```
   

6. **Delete the feature branch if finished (optional)**
   ```bash
   git branch -d feature/<feature-name>
   git push origin --delete feature/<feature-name>
   ```

---

## 2) Releasing to Production (`dev` → `master`)

When `dev` is stable and ready to be released:

1. **On GitHub**: Open a **pull request** with  
   - **Base branch** = `master`  
   - **Compare branch** = `dev`  

2. Write a clear description of what is being released.  

3. Request teammates to review and approve.  

4. Once approved and checks have passed, **merge the pull request** into `master`.  

5. Deployment to production happens automatically (if configured).  

---

## 3) Urgent Production Fixes (`hotfix/*` workflow)

1. **Create a hotfix branch from `master`**
   ```bash
   git checkout master
   git pull origin master
   git checkout -b hotfix/<short-description>
   ```

2. **Fix the issue, commit, and push**
   ```bash
   git add .
   git commit -m "fix: resolve urgent production issue"
   git push -u origin hotfix/<short-description>
   ```

3. **On GitHub**: Open a **pull request** from `hotfix/*` into `master`.  
   - Merge once approved and tested.

4. **Sync the fix back into `dev`**
   ```bash
   git checkout dev
   git pull origin dev
   git merge master
   git push origin dev
   ```

---

## 4) Useful Git Commands

- Check status  
  ```bash
  git status
  ```
- Unstage a file  
  ```bash
  git reset HEAD <file>
  ```
- Undo last commit but keep changes  
  ```bash
  git reset --soft HEAD~1
  ```
- Discard local changes (cannot be undone !!)  
  ```bash
  git restore <file>
  git restore .
  ```
- Switch or create a branch  
  ```bash
  git checkout <branch>
  git checkout -b <new-branch>
  ```

---

## 5) Commit Message Examples

- `feat: add user management page`  
- `fix: resolve login token expiration`  
- `docs: update README with usage guide`  
- `refactor: extract form validation logic`  
- `test: add unit tests for user service`  
- `chore: upgrade dependencies`  

---

## 6) Quick Checklist

1. Update `dev`: `git checkout dev && git pull origin dev`  
2. Create branch: `git checkout -b feature/<feature-name>`  
3. Code → `git add .` → `git commit -m "feat: …"`  
4. Merge feature branch into `dev` locally → push `dev`  
5. When ready for release: create a pull request from `dev` to `master` on GitHub  
6. For urgent fixes: create a hotfix branch → pull request to `master` → merge back into `dev`  
