# Start Story

Automates story setup: **git worktree (optional)**, feature branch, sprint tracking, ATDD test suggestion, contextual research, and plan mode entry.

**Project-specific overrides:**
- **Worktree setup:** Prompts for isolated development environment
- **Plan storage:** Uses `docs/implementation-artifacts/plans/` (version-controlled)

## Usage

```
/start-story E01-S03
/start-story          # picks next backlog story
```

## Workflow Steps

### Step 0: Git Worktree Setup

**Before any story creation**, ask the user:

```
🌳 Would you like to create a git worktree for this story?

✅ **Recommended for:**
- Multi-day stories
- Features requiring testing in parallel
- When you want to keep main workspace stable

❌ **Skip for:**
- Quick hotfixes
- Simple documentation updates
- Experiments or spike work

**Your choice:** [Yes/No]
```

#### If User Says YES:

1. **Extract story information:**
   ```bash
   STORY_KEY="E01-S04"              # From user input or next backlog story
   STORY_TITLE="session timeout"    # From user input or story description
   ```

2. **Create worktree:**
   ```bash
   worktree-story ${STORY_KEY} "${STORY_TITLE}"
   # Creates: /Volumes/SSD/Dev/Asia Trip-worktrees/e01-s04
   # Branch: feature/e01-s04-session-timeout
   ```

3. **Set working directory:**
   ```bash
   STORY_KEY_LOWER=$(echo "${STORY_KEY}" | tr '[:upper:]' '[:lower:]')
   cd "/Volumes/SSD/Dev/Asia Trip-worktrees/${STORY_KEY_LOWER}"
   ```

4. **Inform user:**
   ```
   ✨ Worktree created successfully!

   📍 Location: /Volumes/SSD/Dev/Asia Trip-worktrees/{story-key}
   🌿 Branch: feature/{story-key}-{description}

   📝 All story files will be created here.
   🧑‍💻 You can develop in isolation without affecting your main workspace.

   🧹 When done: /finish-story will offer to clean up, or use:
      worktree-cleanup {story-key}
   ```

5. **Continue story creation in worktree directory**

#### If User Says NO:

1. **Set working directory:**
   ```bash
   cd "/Volumes/SSD/Dev/Asia Trip"
   ```

2. **Continue story creation in main workspace**

### Step 1-N: Standard Story Creation

After worktree decision, proceed with normal story creation:

1. Create story markdown file (in current working directory)
2. Set up initial tests (if applicable)
3. Create implementation plan in `docs/implementation-artifacts/plans/`
4. Update sprint-status.yaml
5. Open in VSCode (worktree or main workspace)

**Important:** All file operations happen in the CURRENT working directory (worktree or main workspace based on user's choice in Step 0).

## Configuration

```yaml
trigger: start-story
description: Start a new story with automated setup and optional worktree
version: 3.0.0-project-override
```

## Changes from Global Skill

This project-specific override adds/changes:

1. **Git Worktree Integration (NEW):**
   - Prompts user for worktree creation before story setup
   - Uses `worktree-story` script for automated worktree creation
   - Switches working directory to worktree if created

2. **Plan Storage:**
   - ❌ **Global skill:** `/Users/pedro/.claude/plans/` (not version-controlled)
   - ✅ **This project:** `docs/implementation-artifacts/plans/` (committed to git)

3. **Working Directory Awareness:**
   - Detects if running in worktree vs main workspace
   - Creates all artifacts in appropriate location

## Variables Reference

When implementing this workflow, extract/use:

| Variable | Example | Source |
|----------|---------|--------|
| `STORY_KEY` | `E01-S04` | User input or next backlog story |
| `STORY_TITLE` | `session timeout handling` | User input or story description |
| `STORY_KEY_LOWER` | `e01-s04` | Lowercase version of STORY_KEY |
| `WORKTREE_PATH` | `/Volumes/SSD/Dev/Asia Trip-worktrees/e01-s04` | Computed from STORY_KEY_LOWER |
| `CURRENT_DIR` | `pwd` | Current working directory after Step 0 |

## Integration Points

### With Existing Scripts

- **`worktree-story`:** Creates worktree and branches (both main repo and tripflow-next)
- **`worktree-cleanup`:** Removes worktree (called by `/finish-story`)
- **`worktree-list`:** Lists active worktrees

### With Other Skills

- **`/review-story`:** Works in both worktree and main workspace
- **`/finish-story`:** Detects worktree and offers cleanup
- **BMAD workflows:** All work with worktree paths

---

**Note:** This file serves as instructions for the `/start-story` skill behavior. When you invoke `/start-story` in this project:
1. You'll be prompted about worktree creation
2. Plans will be created in `docs/implementation-artifacts/plans/`
3. All operations will happen in the appropriate directory (worktree or main)
