# Finish Story

Complete a story: validation, push, PR creation, and worktree cleanup after merge.

**Project-specific skill:** Integrates with git worktree workflow and BMAD sprint tracking.

## Usage

```
/finish-story          # finishes current story
/finish-story E01-S03  # finishes specific story
```

## Workflow Steps

### Step 1: Pre-Flight Checks

Verify completion before proceeding:

```bash
# Check all tests passing
cd tripflow-next && npm test

# Check all files committed
git status --porcelain

# Check no uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ Uncommitted changes detected"
  exit 1
fi
```

**If any check fails:**
```
❌ Cannot finish story:
   • Tests failing
   • Uncommitted changes remain
   • Story requirements not met

Please fix these issues and run /finish-story again.
```

**Stop workflow if checks fail.**

### Step 2: Push & Create PR

Push branch and create GitHub PR:

```bash
# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Push to remote
git push -u origin ${CURRENT_BRANCH}

# Create PR with auto-generated description
gh pr create --fill

# Capture PR URL
PR_URL=$(gh pr view --json url -q .url)
```

Display to user:

```
✅ Pull Request Created!
🔗 {PR_URL}

📋 Please review and merge the PR on GitHub.
```

### Step 3: Ask About Merge Status

**CRITICAL:** Wait for user to merge PR, then ask:

```
Has the PR been merged?

[Yes] - Cleanup worktree and finish
[No]  - Keep worktree for more changes
```

### Step 4a: If User Says NO (PR Not Merged)

```
👍 Keeping worktree active.

You can:
• Make additional changes
• Push more commits
• Run /finish-story again after merge
• Or manually cleanup: worktree-cleanup {story-key}

📍 Worktree location: {worktree-path}
🌿 Branch: {branch-name}
```

**Exit workflow.** Worktree remains active.

### Step 4b: If User Says YES (PR is Merged)

Execute full cleanup:

```bash
# Detect if in worktree
WORKTREE_ROOT=$(git rev-parse --show-toplevel)

if [[ "${WORKTREE_ROOT}" == *"worktrees"* ]]; then
  # Extract story key from path
  STORY_KEY=$(basename "${WORKTREE_ROOT}" | tr '[:lower:]' '[:upper:]')
  STORY_KEY_LOWER=$(basename "${WORKTREE_ROOT}")
  WORKTREE_PATH="${WORKTREE_ROOT}"
  BRANCH_NAME=$(git branch --show-current)

  echo "🧹 Cleaning up worktree..."

  # Switch to main workspace
  cd "/Volumes/SSD/Dev/Asia Trip"

  # Remove worktree (uses existing script)
  worktree-cleanup ${STORY_KEY_LOWER}

  # Switch to main branch
  git checkout main

  # Pull latest changes (includes merged PR)
  git pull

  echo ""
  echo "✅ Cleanup complete!"
  echo "📂 You're now in main workspace"
  echo "🌿 On branch: main"
  echo "🔄 Latest changes pulled"
else
  echo "⚠️  Not in a worktree, skipping cleanup"
  echo "📂 You're in main workspace"
fi
```

### Step 5: Update Story Status

Mark story as completed in BMAD tracking:

```bash
# Update sprint-status.yaml
# Mark story as DONE
# Add completion timestamp
# Update story file status
```

Display completion:

```
✨ Story Complete!

Summary:
✅ PR merged: {PR_URL}
✅ Worktree cleaned up
✅ Switched to main branch
✅ Latest changes pulled
✅ Story marked as DONE

Ready for next story: /start-story
```

## Configuration

```yaml
trigger: finish-story
description: Complete story with validation, PR, and post-merge cleanup
version: 2.0.0-project-override
```

## Interactive Prompt

The skill asks **one question** after PR creation:

**"Has the PR been merged?"**
- **YES:** Proceeds to cleanup (Step 4b)
- **NO:** Exits, keeps worktree active (Step 4a)

This allows you to:
1. Create PR immediately
2. Review/merge PR at your own pace
3. Return to finish cleanup when ready

## Commit Message Format

```
feat(E01-S03): user login session management

Implements E01-S03 with:
- Session token management
- Secure cookie storage
- Auto-refresh on activity

Story: tripflow-next/docs/stories/E01-epic-01/E01-S03-*.md

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## PR Description Format

```markdown
## Story: E01-S03 - User Login Session Management

### Implements
- ✅ Session token storage
- ✅ Secure HttpOnly cookies
- ✅ Auto-refresh on activity
- ✅ Logout clears session

### Acceptance Criteria
- [x] User can log in and session persists
- [x] Session expires after 24h inactivity
- [x] Logout clears all session data
- [x] Tests cover session lifecycle

### Related Files
- Story: [E01-S03](tripflow-next/docs/stories/E01-epic-01/E01-S03-*.md)
- Epic: [E01](tripflow-next/docs/epics/E01-*.md)

### Testing
- ✅ Unit tests: 12 passing
- ✅ E2E tests: story-e01-s02.spec.ts passing
- ✅ Manual testing: verified in dev

🤖 Generated with /finish-story
```

## Integration with BMAD

- Updates sprint-status.yaml via BMAD sprint tracking
- Uses story file format from epics/stories
- Integrates with git worktree workflow
- Follows TripFlow commit conventions

## When NOT to Use

- If tests are still failing (fix first)
- If story isn't truly complete (partial work)
- If you have uncommitted changes
- For exploratory work not tied to a story

## Variables Used

| Variable | Example | Extracted From |
|----------|---------|----------------|
| `WORKTREE_ROOT` | `/Volumes/.../worktrees/e01-s04` | `git rev-parse --show-toplevel` |
| `STORY_KEY` | `E01-S04` | Worktree directory name (uppercase) |
| `STORY_KEY_LOWER` | `e01-s04` | Worktree directory name (lowercase) |
| `BRANCH_NAME` | `feature/e01-s04-session-timeout` | `git branch --show-current` |
| `PR_URL` | `https://github.com/.../pull/123` | `gh pr view --json url` |

## Integration with Existing Scripts

- **`worktree-cleanup`:** Called in Step 4b to remove worktree
- **`gh pr create`:** Creates PR with auto-generated description
- **`gh pr view`:** Gets PR URL for display

## Timing Considerations

**Session continuity:** This workflow spans two phases:
1. **Immediate:** Pre-flight → Push → PR creation → Ask question
2. **Deferred:** User merges PR (minutes to days later)
3. **Completion:** User answers "Yes" → Cleanup executes

If you close terminal after Step 3, simply run `/finish-story` again - it will:
- Detect PR already exists
- Skip to Step 3 (ask about merge)
- Continue to cleanup if merged

---

**Note:** This skill is the final step in the story workflow: `/start-story` → implementation → `/review-story` → `/finish-story`.
