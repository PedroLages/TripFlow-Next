#!/bin/bash
# Burn-In Loop - Detect flaky tests locally
# Usage: ./scripts/burn-in.sh [iterations]

set -e

ITERATIONS=${1:-10}

echo "🔥 Starting burn-in loop - detecting flaky tests"
echo "📊 Running $ITERATIONS iterations"
echo ""

for i in $(seq 1 $ITERATIONS); do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔥 Burn-in iteration $i/$ITERATIONS"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if ! npm run test:e2e; then
    echo ""
    echo "❌ Test failure detected on iteration $i"
    echo "⚠️  This indicates a flaky test - investigate and fix"
    echo ""
    echo "💡 Tips:"
    echo "   - Check test-results/ for failure details"
    echo "   - Look for timing issues or race conditions"
    echo "   - Review test isolation (shared state?)"
    echo "   - Check network mocks and data fixtures"
    exit 1
  fi
  
  echo "✅ Iteration $i passed"
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Burn-in complete - no flaky tests detected!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
