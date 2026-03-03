#!/usr/bin/env bash
# Worktree Cleanup Command
# Usage: worktree-cleanup <story-key>
# Example: worktree-cleanup e01-s03

set -e

STORY_KEY="$1"

if [[ -z "$STORY_KEY" ]]; then
  echo "❌ Error: Story key required"
  echo ""
  echo "Usage: worktree-cleanup <story-key>"
  echo "Example: worktree-cleanup e01-s03"
  echo ""
  echo "This removes the worktree and optionally deletes the branch."
  exit 1
fi

# Configuration
PROJECT_ROOT="/Volumes/SSD/Dev/Asia Trip"
WORKTREE_BASE="/Volumes/SSD/Dev/Asia Trip-worktrees"

# Normalize story key
STORY_KEY_LOWER=$(echo "$STORY_KEY" | tr '[:upper:]' '[:lower:]')
WORKTREE_PATH="${WORKTREE_BASE}/${STORY_KEY_LOWER}"

# Check if worktree exists
if [[ ! -d "$WORKTREE_PATH" ]]; then
  echo "⚠️  Worktree not found: $WORKTREE_PATH"
  echo ""
  echo "Available worktrees:"
  cd "$PROJECT_ROOT" && git worktree list
  exit 1
fi

echo "🧹 Cleaning up worktree: $STORY_KEY_LOWER"
echo "📂 Location: $WORKTREE_PATH"
echo ""

# Get the branch name from the worktree
cd "$WORKTREE_PATH"
BRANCH_NAME=$(git branch --show-current)

echo "🌿 Branch: $BRANCH_NAME"
echo ""

# Monorepo: No nested repo to clean up

# Remove main worktree
echo ""
echo "🔗 Removing main worktree..."
cd "$PROJECT_ROOT"
git worktree remove "$WORKTREE_PATH" --force

# Ask about deleting main branch
read -p "🗑️  Delete branch '$BRANCH_NAME' from main repo? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  git branch -D "$BRANCH_NAME" 2>/dev/null || echo "⚠️  Branch not found or already deleted"
  echo "✅ Branch deleted from main repo"
fi

echo ""
echo "✨ Cleanup complete!"
echo ""
echo "📋 Remaining worktrees:"
git worktree list
echo ""

exit 0
