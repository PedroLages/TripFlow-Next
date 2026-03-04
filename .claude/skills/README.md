# Project-Specific Skills

This directory contains custom skills for the Asia Trip / TripFlow project.

## Story Workflow Skills

Complete workflow for BMAD story development with git worktree integration.

### Available Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/start-story [E01-S03]` | Start story development | Beginning work on a new story |
| `/review-story [E01-S03]` | Review implementation | Before finishing, to validate readiness |
| `/finish-story [E01-S03]` | Complete story | After review passes, to commit and close |

### Complete Workflow

```mermaid
graph TD
    A[Pick Story] --> B[/start-story]
    B --> C[Creates Worktree]
    C --> D[Implement Features]
    D --> E[Write Tests]
    E --> F[/review-story]
    F --> G{All Checks Pass?}
    G -->|No| H[Fix Issues]
    H --> F
    G -->|Yes| I[/finish-story]
    I --> J[Commit & PR]
    J --> K[Cleanup Worktree]
    K --> L[Done!]
```

### Usage Example

```bash
# 1. Start a new story
/start-story E01-S03

# 📋 You'll be prompted:
# "Would you like to create a git worktree for this story? [Yes/No]"

# If YES - Creates:
# - Worktree at: /Volumes/SSD/Dev/Asia Trip-worktrees/e01-s03
# - Feature branch: feature/e01-s03
# - All operations happen in worktree
# - Main workspace remains untouched

# If NO - Creates:
# - Feature branch in main workspace
# - All operations happen in current directory

# Both create:
# - Implementation plan in docs/implementation-artifacts/plans/
# - Updates sprint-status.yaml
# - Opens in VSCode

# 2. Implement the story
# ... write code, tests, docs ...
# (in worktree or main workspace, depending on Step 1 choice)

# 3. Review before completion
/review-story

# This checks:
# ✅ Tests pass (npm test)
# ✅ Linting clean (npm run lint)
# ✅ Code quality (BMAD code-review)
# ✅ Acceptance criteria met
# ✅ Documentation updated

# 4. Finish the story
/finish-story

# This runs:
# ✅ Pre-flight validation (tests, commits)
# ✅ Pushes to remote
# ✅ Creates GitHub PR automatically
# ✅ Shows PR URL
#
# Then asks: "Has the PR been merged?"
# → If NO:  Keeps worktree active, exit
# → If YES: Cleans up worktree, switches to main, pulls latest, updates story status
```

### Project-Specific Overrides

#### `/start-story`
- **Worktree Setup (NEW):** Prompts user to create isolated git worktree before story creation
- **Override:** Plans stored in `docs/implementation-artifacts/plans/` (not `~/.claude/plans/`)
- **Reason:** Keep plans version-controlled; enable isolated development
- **Version:** 3.0.0-project-override

#### `/review-story`
- **Integration:** TripFlow test suite and style guide
- **Checks:** E2E tests in `tripflow-next/e2e/story-*.spec.ts`
- **Style Guide:** `tripflow-next/docs/TRIPFLOW-STYLE-GUIDE.md`

#### `/finish-story`
- **Integration:** Git worktree workflow
- **Cleanup:** Runs `worktree-cleanup` script
- **Tracking:** Updates `sprint-status.yaml`

### File Locations

```
.claude/skills/
├── README.md                    # This file
├── start-story/
│   └── skill.md                 # Story setup automation
├── review-story/
│   └── skill.md                 # Pre-completion validation
└── finish-story/
    └── skill.md                 # Completion and cleanup
```

### Related Scripts

These bash scripts are used by the skills:

- `.claude/commands/worktree-story.sh` - Create worktrees
- `.claude/commands/worktree-cleanup.sh` - Remove worktrees
- `.claude/commands/worktree-list.sh` - List active worktrees

### Integration with BMAD

The skills wrap BMAD workflows:

- `bmad:bmm:workflows:create-story` - Story creation
- `bmad:bmm:workflows:dev-story` - Story development
- `bmad:bmm:workflows:code-review` - Code quality validation
- `bmad:bmm:workflows:sprint-status` - Sprint tracking

### Troubleshooting

**Skill not found:**
```bash
# Verify skills are recognized
ls -la .claude/skills/

# Each should have a skill.md file
```

**Review fails:**
```bash
# Run checks manually
cd tripflow-next
npm test
npm run lint

# Check specific E2E test
npm run test:e2e -- story-e01-s02.spec.ts
```

**Finish blocked:**
```bash
# Review must pass first
/review-story

# Fix any issues found
# Then try /finish-story again
```

**Worktree issues:**
```bash
# List worktrees
worktree-list

# Clean up manually
worktree-cleanup e01-s03
```

### Best Practices

1. **Always start with `/start-story`** - Don't create branches manually
2. **Review before finishing** - Run `/review-story` to catch issues early
3. **Fix issues immediately** - Don't defer test failures or lint errors
4. **Clean up worktrees** - Accept cleanup when `/finish-story` prompts
5. **One story at a time** - Finish current story before starting next

### Why This Workflow?

- **Isolation:** Worktrees keep stories separate from main workspace
- **Quality:** Automated checks prevent incomplete work from being merged
- **Tracking:** Sprint status always reflects current state
- **Speed:** No context switching, no stashing, no conflicts
- **Confidence:** Every story follows same validation process

---

**Last Updated:** 2026-03-03
**Maintainer:** Project team
**Documentation:** See individual skill.md files for detailed behavior
