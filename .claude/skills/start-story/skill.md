# Start Story

Automates story setup: feature branch, sprint tracking, ATDD test suggestion, contextual research, and plan mode entry.

**Project-specific override:** Uses `docs/implementation-artifacts/plans/` for plan storage (version-controlled).

## Usage

```
/start-story E01-S03
/start-story          # picks next backlog story
```

## Configuration

```yaml
trigger: start-story
description: Start a new story with automated setup
version: 2.0.0-project-override
```

## Changes from Global Skill

This project-specific override changes the plan storage location:

- ❌ **Global skill:** `/Users/pedro/.claude/plans/` (not version-controlled)
- ✅ **This project:** `docs/implementation-artifacts/plans/` (committed to git)

All other behavior remains the same as the global `/start-story` skill.

---

**Note:** This file serves as documentation of the override. The actual skill logic is handled by Claude Code. When you invoke `/start-story` in this project, plans will be created in `docs/implementation-artifacts/plans/` automatically.
