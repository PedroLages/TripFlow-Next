#!/usr/bin/env bash
# Worktree Story Command
# Usage: worktree-story <story-key> [story-title]
# Example: worktree-story E01-S03 "user login validation"

set -e

STORY_KEY="$1"
STORY_TITLE="${2:-}"

if [[ -z "$STORY_KEY" ]]; then
  echo "❌ Error: Story key required"
  echo ""
  echo "Usage: worktree-story <story-key> [story-title]"
  echo "Example: worktree-story E01-S03 \"user login validation\""
  echo ""
  echo "This creates a new git worktree for isolated story development."
  exit 1
fi

# Configuration
PROJECT_ROOT="/Volumes/SSD/Dev/Asia Trip"
WORKTREE_BASE="/Volumes/SSD/Dev/Asia Trip-worktrees"
SUBMODULE_DIR="tripflow-next"

# Normalize story key to branch name
STORY_KEY_LOWER=$(echo "$STORY_KEY" | tr '[:upper:]' '[:lower:]')

if [[ -n "$STORY_TITLE" ]]; then
  TITLE_SLUG=$(echo "$STORY_TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')
  BRANCH_NAME="feature/${STORY_KEY_LOWER}-${TITLE_SLUG}"
else
  BRANCH_NAME="feature/${STORY_KEY_LOWER}"
fi

WORKTREE_PATH="${WORKTREE_BASE}/${STORY_KEY_LOWER}"

# Check if worktree already exists
if [[ -d "$WORKTREE_PATH" ]]; then
  echo "✅ Worktree already exists!"
  echo "📍 Location: $WORKTREE_PATH"
  echo "🌿 Branch: $BRANCH_NAME"
  echo ""
  echo "To switch to it:"
  echo "   cd $WORKTREE_PATH"
  exit 0
fi

# Create worktrees directory
mkdir -p "$WORKTREE_BASE"

echo "🌳 Creating git worktree for story: $STORY_KEY"
echo "📂 Location: $WORKTREE_PATH"
echo "🌿 Branch: $BRANCH_NAME"
echo ""

# Create worktree in parent repo
cd "$PROJECT_ROOT"

# Check if branch already exists remotely
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
  echo "⚠️  Branch '$BRANCH_NAME' already exists locally"
  echo "Creating worktree from existing branch..."
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
else
  echo "Creating new branch from current HEAD..."
  git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME"
fi

# Handle tripflow-next directory
if [[ -d "$PROJECT_ROOT/$SUBMODULE_DIR/.git" ]]; then
  echo ""
  echo "🔗 Setting up $SUBMODULE_DIR worktree..."

  cd "$PROJECT_ROOT/$SUBMODULE_DIR"

  # Get current branch or default
  CURRENT_BRANCH=$(git branch --show-current)
  BASE_BRANCH="${CURRENT_BRANCH:-feat/itinerary-redesign}"

  # Check if branch exists in submodule
  if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo "⚠️  Branch '$BRANCH_NAME' already exists in $SUBMODULE_DIR"
    git worktree add "$WORKTREE_PATH/$SUBMODULE_DIR" "$BRANCH_NAME"
  else
    echo "Creating new branch in $SUBMODULE_DIR from: $BASE_BRANCH"
    git worktree add "$WORKTREE_PATH/$SUBMODULE_DIR" -b "$BRANCH_NAME" "$BASE_BRANCH"
  fi

  echo "✅ $SUBMODULE_DIR worktree created"
fi

echo ""
echo "✨ Worktree setup complete!"
echo ""
echo "📋 Next steps:"
echo "   cd $WORKTREE_PATH"
echo ""
echo "🧪 Test your setup:"
echo "   cd $WORKTREE_PATH/$SUBMODULE_DIR && npm run dev"
echo ""
echo "🧹 When done, clean up with:"
echo "   worktree-cleanup $STORY_KEY_LOWER"
echo ""

# Open in VSCode if available
if command -v code &> /dev/null; then
  read -p "📝 Open in VSCode? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    code "$WORKTREE_PATH"
    echo "✅ Opened in VSCode"
  fi
fi

exit 0
