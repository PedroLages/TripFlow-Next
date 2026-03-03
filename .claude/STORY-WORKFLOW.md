# Story Workflow Quick Reference

Complete BMAD story development workflow with git worktree integration.

## 🚀 Quick Start

```bash
/start-story E01-S03   # Start new story
# ... implement features and tests ...
/review-story          # Validate before completion
/finish-story          # Complete and create PR
```

## 📋 Available Commands

### `/start-story [story-key]`
**When:** Beginning work on a new story

**Step 0 - Worktree Decision:**
Prompts: "Would you like to create a git worktree for this story?"
- **YES:** Creates isolated worktree + all operations happen there
- **NO:** Works in main workspace

**Does:**
- **If worktree:** Creates worktree at `/Volumes/SSD/Dev/Asia Trip-worktrees/e01-s03`
- Creates feature branch (`feature/e01-s03`)
- Updates sprint-status.yaml
- Generates implementation plan in `docs/implementation-artifacts/plans/`
- Opens in VSCode (worktree or main workspace)

**Example:**
```bash
/start-story E01-S03
# Prompts for worktree: [Yes/No]
# If Yes: creates /Volumes/SSD/Dev/Asia Trip-worktrees/e01-s03
# If No: continues in main workspace

/start-story          # picks next backlog story
```

### `/review-story [story-key]`
**When:** Before finishing, to validate readiness
**Does:**
- ✅ Runs tests (`npm test`)
- ✅ Checks linting (`npm run lint`)
- ✅ Runs E2E tests for story
- ✅ BMAD code review (finds 3-10 specific issues)
- ✅ Validates acceptance criteria
- ✅ Checks documentation updated
- ✅ Verifies TripFlow style guide compliance

**Example:**
```bash
/review-story         # review current story
/review-story E01-S03 # review specific story
```

### `/finish-story [story-key]`
**When:** After review passes, ready to close story

**Workflow:**
1. **Pre-flight checks** - Tests pass, all committed
2. **Push & PR** - Pushes branch, creates GitHub PR
3. **Asks: "Has the PR been merged?"**
   - **NO:** Keeps worktree active for more changes
   - **YES:** Cleans up worktree, switches to main, pulls latest

**Does:**
- ✅ Pre-flight validation
- ✅ Pushes to remote
- ✅ Creates PR automatically
- ✅ Waits for you to merge PR
- ✅ Cleans up worktree after merge
- ✅ Updates story status to "Done"

**Example:**
```bash
/finish-story         # finish current story

# Output:
# ✅ Pre-flight checks passed
# ✅ Pushed to remote
# ✅ PR created: https://github.com/.../pull/123
#
# Has the PR been merged? [Yes/No]
# → If No: Keeps worktree, exit
# → If Yes: Cleanup and finish
```

## 🔄 Complete Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 0. Start Story                                          │
│    /start-story E01-S03                                 │
│    → Prompt: Create worktree? [Yes/No]                 │
└─────────────────────────────────────────────────────────┘
                         ↓
                    ┌────┴────┐
                    │Worktree?│
                    └────┬────┘
                   Yes ↙    ↘ No
         ┌──────────────┐   ┌──────────────┐
         │ Create       │   │ Main         │
         │ Worktree     │   │ Workspace    │
         └──────┬───────┘   └──────┬───────┘
                ↓                   ↓
                └─────────┬─────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 1. Setup Complete                                       │
│    → Creates branch                                     │
│    → Generates plan                                     │
│    → Opens in VSCode                                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Implement                                            │
│    → Write code                                         │
│    → Write tests                                        │
│    → Update docs                                        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Review                                               │
│    /review-story                                        │
│    → Tests passing?                                     │
│    → Linting clean?                                     │
│    → Code quality OK?                                   │
└─────────────────────────────────────────────────────────┘
                         ↓
                    ┌────┴────┐
                    │ Issues? │
                    └────┬────┘
                   Yes ↙    ↘ No
              ┌────────┐   ┌────────┐
              │  Fix   │   │ Finish │
              │ Issues │   │ Story  │
              └───┬────┘   └────────┘
                  ↓             ↓
                  └─────→  /finish-story
                              ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Push & PR                                            │
│    → Pre-flight checks                                  │
│    → Push to remote                                     │
│    → Create GitHub PR                                   │
└─────────────────────────────────────────────────────────┘
                         ↓
                ┌────────────────┐
                │  PR Merged?    │
                └────┬───────────┘
              No ↙      ↘ Yes
    ┌──────────────┐   ┌──────────────┐
    │ Keep         │   │ Cleanup      │
    │ Worktree     │   │ Worktree     │
    │ Active       │   │ Switch Main  │
    │              │   │ Pull Latest  │
    └──────────────┘   └──────┬───────┘
                              ↓
                    ┌──────────────────┐
                    │ Update Status    │
                    │ Done! ✅          │
                    └──────────────────┘
```

## 🎯 Best Practices

1. **Always start with `/start-story`**
   Don't create branches manually - the skill handles worktrees properly

2. **Review before finishing**
   Run `/review-story` to catch issues early

3. **Fix issues immediately**
   Don't defer test failures or lint errors to later

4. **One story at a time**
   Finish current story before starting next (worktrees allow parallel work if needed)

5. **Accept cleanup prompts**
   Keep your workspace clean by removing finished worktrees

## 📁 File Locations

```
.claude/
├── skills/
│   ├── start-story/skill.md      # Story setup
│   ├── review-story/skill.md     # Pre-completion validation
│   ├── finish-story/skill.md     # Completion & cleanup
│   └── README.md                 # Detailed documentation
└── commands/
    ├── worktree-story.sh         # Create worktrees
    ├── worktree-cleanup.sh       # Remove worktrees
    └── worktree-list.sh          # List active worktrees

docs/implementation-artifacts/
└── plans/                        # Implementation plans (version-controlled)

tripflow-next/
├── docs/
│   ├── stories/                  # Story files
│   └── TRIPFLOW-STYLE-GUIDE.md   # Coding standards
└── e2e/
    └── story-*.spec.ts           # Story E2E tests
```

## 🔧 Manual Operations

If you need to work with worktrees manually:

```bash
# Create worktree
worktree-story E01-S03 "user login validation"

# List worktrees
worktree-list

# Clean up
worktree-cleanup e01-s03
```

## ❌ Common Mistakes

| ❌ Don't Do | ✅ Do Instead |
|-------------|---------------|
| Create branch manually | Use `/start-story` |
| Skip review step | Always `/review-story` first |
| Commit with failing tests | Fix tests, then `/finish-story` |
| Leave worktrees after merge | Accept cleanup prompt |
| Work on multiple stories simultaneously | Finish one before starting next |

## 🆘 Troubleshooting

**Skills not recognized:**
```bash
ls -la .claude/skills/
# Each should have a skill.md file
```

**Review fails:**
```bash
cd tripflow-next
npm test                              # Run all tests
npm run lint                          # Check linting
npm run test:e2e -- story-e01-s02.spec.ts  # Specific E2E test
```

**Worktree issues:**
```bash
worktree-list                         # See all worktrees
worktree-cleanup e01-s03              # Manual cleanup
git worktree prune                    # Clean stale references
```

**Finish blocked:**
```bash
/review-story                         # See what's blocking
# Fix issues, then retry /finish-story
```

## 📚 Integration

These skills integrate with:
- **BMAD Workflows:** `code-review`, `sprint-status`, `dev-story`
- **Git Worktrees:** Isolated story development
- **TripFlow Standards:** Style guide compliance
- **Sprint Tracking:** Automatic status updates

## 📖 More Info

For detailed documentation, see:
- [`.claude/skills/README.md`](.claude/skills/README.md) - Full skill documentation
- [`tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md`](tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md) - Coding standards
- [`.claude/commands/worktree-*.sh`](.claude/commands/) - Worktree scripts

---

**Last Updated:** 2026-03-03
**Version:** 1.0.0
**Maintainer:** Project team
