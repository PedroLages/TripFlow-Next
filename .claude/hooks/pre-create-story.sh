#!/usr/bin/env bash
# Pre-Create-Story Hook: Automatic Git Worktree Setup
# Triggered when /create-story workflow starts
#
# This hook automatically creates a new git worktree for each story,
# enabling parallel development without branch switching.

set -e

# Extract story key from the workflow context
STORY_KEY="${STORY_KEY:-}"
STORY_TITLE="${STORY_TITLE:-}"

# If no story key provided, skip worktree creation
if [[ -z "$STORY_KEY" ]]; then
  echo "ℹ️  No story key provided - skipping worktree creation"
  exit 0
fi

# Configuration
PROJECT_ROOT="/Volumes/SSD/Dev/Asia Trip"
WORKTREE_BASE="/Volumes/SSD/Dev/Asia Trip-worktrees"
SUBMODULE_DIR="tripflow-next"

# Normalize story key to branch name (e.g., E01-S03 -> e01-s03)
STORY_KEY_LOWER=$(echo "$STORY_KEY" | tr '[:upper:]' '[:lower:]')
BRANCH_NAME="feature/${STORY_KEY_LOWER}-$(echo "$STORY_TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')"
WORKTREE_PATH="${WORKTREE_BASE}/${STORY_KEY_LOWER}"

# Check if worktree already exists
if [[ -d "$WORKTREE_PATH" ]]; then
  echo "✅ Worktree already exists at: $WORKTREE_PATH"
  echo "📍 Branch: $BRANCH_NAME"
  exit 0
fi

# Create worktrees directory if it doesn't exist
mkdir -p "$WORKTREE_BASE"

echo "🌳 Creating git worktree for story: $STORY_KEY"
echo "📂 Location: $WORKTREE_PATH"
echo "🌿 Branch: $BRANCH_NAME"

# Create worktree in parent repo
cd "$PROJECT_ROOT"
git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME"

# Handle submodule/nested repo
if [[ -d "$PROJECT_ROOT/$SUBMODULE_DIR/.git" ]]; then
  echo "🔗 Setting up $SUBMODULE_DIR worktree..."

  # Get the current branch from main worktree's submodule
  SUBMODULE_CURRENT_BRANCH=$(cd "$PROJECT_ROOT/$SUBMODULE_DIR" && git branch --show-current)
  SUBMODULE_BASE_BRANCH="${SUBMODULE_CURRENT_BRANCH:-feat/itinerary-redesign}"

  # Create matching branch in submodule worktree
  cd "$PROJECT_ROOT/$SUBMODULE_DIR"
  git worktree add "$WORKTREE_PATH/$SUBMODULE_DIR" -b "$BRANCH_NAME" "$SUBMODULE_BASE_BRANCH"

  echo "✅ Submodule worktree created from branch: $SUBMODULE_BASE_BRANCH"
fi

echo ""
echo "✨ Worktree setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. cd $WORKTREE_PATH"
echo "   2. Continue with /create-story workflow"
echo "   3. Develop in isolation - your main worktree is untouched!"
echo ""
echo "🧹 To clean up when done:"
echo "   git worktree remove $WORKTREE_PATH"
echo "   cd $PROJECT_ROOT/$SUBMODULE_DIR && git worktree remove $WORKTREE_PATH/$SUBMODULE_DIR"
echo ""

exit 0
