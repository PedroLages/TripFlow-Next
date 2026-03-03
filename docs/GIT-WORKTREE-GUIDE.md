# Git Worktree Guide for TripFlow Development

## Overview

This project uses **Git Worktrees** to enable parallel development on multiple stories without branch switching. Each story gets its own isolated workspace.

## 📋 Table of Contents

1. [What are Git Worktrees?](#what-are-git-worktrees)
2. [Why Use Worktrees?](#why-use-worktrees)
3. [Commands](#commands)
4. [Workflow](#workflow)
5. [Nested Repository Setup](#nested-repository-setup)
6. [Troubleshooting](#troubleshooting)

---

## What are Git Worktrees?

Git worktrees allow you to have **multiple working directories** for the same repository, each checked out to different branches simultaneously.

**Traditional workflow:**
```bash
git checkout feature-a    # Switch branch
# Work on feature A
git checkout feature-b    # Switch branch (lose context)
# Work on feature B
```

**Worktree workflow:**
```bash
# Both exist simultaneously!
~/Asia Trip/                    # feature-a (running dev server)
~/Asia Trip-worktrees/e01-s03/  # feature-b (running tests)
```

---

## Why Use Worktrees?

### ✅ Benefits

1. **No Context Switching**
   - Work on Story A while Story B's tests run
   - Review PRs without stopping your dev server

2. **Parallel Services**
   ```bash
   # Worktree 1: Main development
   cd ~/Asia\ Trip/tripflow-next && npm run dev      # Port 3000

   # Worktree 2: Testing new feature
   cd ~/Asia\ Trip-worktrees/e01-s03/tripflow-next && npm run dev  # Port 3001
   ```

3. **Clean Separation**
   - Each worktree has its own `node_modules/`, `.next/`, build artifacts
   - No stashing or committing incomplete work
   - Branch-specific environment variables

4. **BMAD Story Isolation**
   - Each story lives in its own directory
   - Easy to track which code belongs to which story
   - Simplifies code review and testing

---

## Commands

All commands are in `.claude/commands/`:

### Create Worktree for Story

```bash
worktree-story <story-key> [story-title]
```

**Examples:**
```bash
# Basic usage
worktree-story E01-S03

# With descriptive title
worktree-story E01-S03 "user login validation"

# Creates:
# - Worktree at: /Volumes/SSD/Dev/Asia Trip-worktrees/e01-s03
# - Branch: feature/e01-s03-user-login-validation
# - Nested tripflow-next worktree with same branch
```

### List All Worktrees

```bash
worktree-list
```

Shows all active worktrees for both main repo and tripflow-next.

### Clean Up Worktree

```bash
worktree-cleanup <story-key>
```

**Example:**
```bash
worktree-cleanup e01-s03

# Prompts to:
# 1. Remove worktree directory
# 2. Delete branch (optional)
```

---

## Workflow

### 1. Start New Story (with Worktree)

```bash
# Option A: Create worktree first, then story
worktree-story E01-S04 "session timeout handling"
cd /Volumes/SSD/Dev/Asia\ Trip-worktrees/e01-s04
/create-story

# Option B: Create story in main, then switch to worktree
/create-story
worktree-story E01-S04 "session timeout handling"
cd /Volumes/SSD/Dev/Asia\ Trip-worktrees/e01-s04
```

### 2. Develop in Isolation

```bash
# Your worktree
cd /Volumes/SSD/Dev/Asia\ Trip-worktrees/e01-s04/tripflow-next

# Install dependencies (isolated)
npm install

# Run dev server
npm run dev  # Port 3000

# Run tests
npm test

# All changes are isolated to this worktree!
```

### 3. Main Worktree Untouched

```bash
# Meanwhile, in your main workspace:
cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next

# Different branch, different state
npm run build  # Won't affect your dev worktree
```

### 4. Commit and Push

```bash
# In your story worktree
cd /Volumes/SSD/Dev/Asia\ Trip-worktrees/e01-s04

# Commit changes
git add .
git commit -m "feat(auth): add session timeout handling"

# Push to remote
git push -u origin feature/e01-s04-session-timeout-handling

# Create PR
gh pr create
```

### 5. Clean Up After Merge

```bash
# After PR is merged
worktree-cleanup e01-s04

# Choose:
# - Remove worktree ✅
# - Delete local branch ✅ (already merged)
```

---

## Nested Repository Setup

### Current Structure

```
Asia Trip/                          (main repo)
├── .git/                           (main repo git)
├── docs/                           (trip planning)
├── _bmad/                          (workflows)
└── tripflow-next/                  (nested repo - NOT a submodule)
    ├── .git/                       (separate git history)
    ├── src/
    └── ...
```

**Important:** `tripflow-next/` is a **nested repository**, not a git submodule. This means:

- It's a separate git repo inside the parent repo
- Main repo **ignores** the tripflow-next directory (in `.gitignore`)
- Each has independent branches, commits, and remotes
- Worktree commands handle both automatically

### How Worktrees Handle This

When you create a worktree:

```bash
worktree-story E01-S04
```

**Creates:**
```
Asia Trip-worktrees/e01-s04/
├── .git                           (linked worktree for main repo)
├── docs/                          (shared from main repo)
├── _bmad/                         (shared from main repo)
└── tripflow-next/                 (separate worktree for nested repo!)
    ├── .git                       (linked worktree for tripflow-next)
    ├── src/
    └── ...
```

Both repos get worktrees with **matching branch names**.

---

## Troubleshooting

### Worktree Already Exists

```bash
$ worktree-story E01-S03
✅ Worktree already exists!
📍 Location: /Volumes/SSD/Dev/Asia Trip-worktrees/e01-s03
```

**Solution:** Just `cd` to the existing worktree.

### Branch Conflicts

```bash
fatal: a branch named 'feature/e01-s03-login' already exists
```

**Solutions:**
```bash
# Option 1: Use existing branch
git worktree add ../worktrees/e01-s03 feature/e01-s03-login

# Option 2: Delete old branch first
git branch -D feature/e01-s03-login
worktree-story E01-S03 "login"

# Option 3: Use different name
worktree-story E01-S03 "login-v2"
```

### Can't Remove Worktree

```bash
fatal: 'worktree' contains modified or untracked files
```

**Solution:**
```bash
# Force remove (careful!)
git worktree remove path/to/worktree --force

# Or use cleanup script
worktree-cleanup e01-s03  # Handles force removal
```

### Port Conflicts

```bash
Port 3000 is already in use
```

**Solution:** Each worktree can use different ports:
```bash
# Worktree 1
PORT=3000 npm run dev

# Worktree 2
PORT=3001 npm run dev
```

### Disk Space

Each worktree has its own `node_modules/` and `.next/` directories.

**Check space:**
```bash
du -sh /Volumes/SSD/Dev/Asia\ Trip-worktrees/*

# Typical sizes:
# 500MB - 1GB per worktree (node_modules + build artifacts)
```

**Cleanup old worktrees regularly:**
```bash
worktree-list              # See all worktrees
worktree-cleanup e01-s01   # Remove finished stories
```

---

## Best Practices

### ✅ DO

- Create worktree for each story you're actively developing
- Clean up worktrees after PR merge
- Use descriptive story titles in branch names
- Keep main workspace for stable work only

### ❌ DON'T

- Create worktrees for quick fixes (use main workspace)
- Leave old worktrees indefinitely (disk space)
- Share worktrees between stories
- Manually delete worktree directories (use cleanup command)

---

## Advanced Usage

### Multiple Worktrees Simultaneously

```bash
# Story 1: Implementation
cd /Volumes/SSD/Dev/Asia\ Trip-worktrees/e01-s03/tripflow-next
npm run dev  # Port 3000

# Story 2: Testing
cd /Volumes/SSD/Dev/Asia\ Trip-worktrees/e01-s04/tripflow-next
npm test     # Running in parallel

# Main: Code review
cd /Volumes/SSD/Dev/Asia\ Trip/tripflow-next
gh pr checkout 123  # Review teammate's PR
```

### VSCode Integration

The `worktree-story` command offers to open in VSCode:

```bash
worktree-story E01-S05
# Prompts: 📝 Open in VSCode? (y/n)
```

Or manually:
```bash
code /Volumes/SSD/Dev/Asia\ Trip-worktrees/e01-s05
```

### Manual Worktree Creation

If you prefer manual control:

```bash
# Main repo
cd /Volumes/SSD/Dev/Asia\ Trip
git worktree add ../Asia\ Trip-worktrees/custom -b feature/custom

# Nested repo
cd tripflow-next
git worktree add ../Asia\ Trip-worktrees/custom/tripflow-next -b feature/custom
```

---

## Integration with BMAD Workflows

### Current Integration

The worktree commands integrate with BMAD workflows:

1. **Manual:** Run `worktree-story` before `/create-story`
2. **Automatic:** (Optional) Hook triggers on `/create-story`

### Future: Automatic Worktree Creation

Add to `.claude/hooks/pre-create-story.sh` to auto-create worktrees when starting stories.

---

## Summary

**Quick Reference:**

```bash
# Create story worktree
worktree-story E01-S04 "description"

# Switch to worktree
cd /Volumes/SSD/Dev/Asia\ Trip-worktrees/e01-s04

# Develop as normal
cd tripflow-next && npm run dev

# When done
worktree-cleanup e01-s04
```

**Key Benefits:**
- 🚀 Parallel development
- 🔒 Isolated environments
- 🧹 Clean separation
- ⚡ No context switching

Happy developing! 🎉
