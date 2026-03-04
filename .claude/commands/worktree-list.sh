#!/usr/bin/env bash
# List all git worktrees for the project

PROJECT_ROOT="/Volumes/SSD/Dev/Asia Trip"
SUBMODULE_DIR="tripflow-next"

echo "🌳 Git Worktrees - Main Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$PROJECT_ROOT"
git worktree list

if [[ -d "$PROJECT_ROOT/$SUBMODULE_DIR/.git" ]]; then
  echo ""
  echo "🔗 Git Worktrees - $SUBMODULE_DIR"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cd "$PROJECT_ROOT/$SUBMODULE_DIR"
  git worktree list
fi

echo ""
