#!/bin/bash
# Test Changed Files - Run tests only on files changed in current branch
# Usage: ./scripts/test-changed.sh

set -e

echo "🔍 Detecting changed files..."

# Get changed files compared to main branch
CHANGED_FILES=$(git diff --name-only origin/main...HEAD | grep -E '\.(ts|tsx|js|jsx)$' || true)

if [ -z "$CHANGED_FILES" ]; then
  echo "ℹ️  No test files changed - skipping tests"
  exit 0
fi

echo "📝 Changed files:"
echo "$CHANGED_FILES"
echo ""

# Check if E2E test files changed
if echo "$CHANGED_FILES" | grep -q '^e2e/'; then
  echo "🎭 E2E test files changed - running E2E tests..."
  npm run test:e2e
fi

# Check if unit test files changed
if echo "$CHANGED_FILES" | grep -q '__tests__/'; then
  echo "🧪 Unit test files changed - running unit tests..."
  npm run test
fi

# Check if source files changed (but not test files)
SOURCE_CHANGED=$(echo "$CHANGED_FILES" | grep -v -E '(__tests__|\.test\.|\.spec\.|^e2e/)' || true)
if [ -n "$SOURCE_CHANGED" ]; then
  echo "📦 Source files changed - running related tests..."
  npm run test
  npm run test:e2e
fi

echo "✅ Changed file tests complete"
