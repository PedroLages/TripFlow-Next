#!/bin/bash
# Find Inline Styles Migration Patterns
# Usage: ./scripts/find-inline-styles.sh [pattern]

PATTERN="${1:-}"
SRC_DIR="./src"

echo "==================================="
echo "Inline Styles Migration Helper"
echo "==================================="
echo ""

if [ -z "$PATTERN" ]; then
  echo "Available patterns to search:"
  echo ""
  echo "  1. fontVariantNumeric → tabular-nums"
  echo "  2. objectFit → object-* utilities"
  echo "  3. textDecoration → no-underline, underline"
  echo "  4. margin/padding → Tailwind spacing"
  echo "  5. opacity → opacity-* utilities"
  echo "  6. all → show all inline styles"
  echo ""
  echo "Usage: ./scripts/find-inline-styles.sh [1-6|all]"
  exit 0
fi

case $PATTERN in
  1|fontVariantNumeric)
    echo "🔍 Finding fontVariantNumeric patterns..."
    echo "Replace with: className=\"tabular-nums\""
    echo ""
    grep -rn "fontVariantNumeric" "$SRC_DIR" --include="*.tsx" --include="*.ts" --color=always
    ;;
  2|objectFit)
    echo "🔍 Finding objectFit patterns..."
    echo "Replace with: object-cover, object-contain, object-fill, etc."
    echo ""
    grep -rn "objectFit" "$SRC_DIR" --include="*.tsx" --include="*.ts" --color=always
    ;;
  3|textDecoration)
    echo "🔍 Finding textDecoration patterns..."
    echo "Replace with: no-underline, underline, line-through"
    echo ""
    grep -rn "textDecoration" "$SRC_DIR" --include="*.tsx" --include="*.ts" --color=always
    ;;
  4|spacing)
    echo "🔍 Finding margin/padding patterns..."
    echo "Replace with: m-*, p-*, space-*, gap-*"
    echo ""
    grep -rn "margin\|padding" "$SRC_DIR" --include="*.tsx" --include="*.ts" | grep "style=" --color=always
    ;;
  5|opacity)
    echo "🔍 Finding opacity patterns..."
    echo "Replace with: opacity-0, opacity-50, opacity-100, etc."
    echo ""
    grep -rn "opacity:" "$SRC_DIR" --include="*.tsx" --include="*.ts" | grep "style=" --color=always
    ;;
  all)
    echo "🔍 Finding all inline style patterns..."
    echo ""
    grep -rn "style={" "$SRC_DIR" --include="*.tsx" --include="*.ts" --color=always | head -50
    echo ""
    echo "Showing first 50 results. Total count:"
    grep -rc "style={" "$SRC_DIR" --include="*.tsx" --include="*.ts" | grep -v ":0$" | wc -l
    ;;
  *)
    echo "❌ Unknown pattern: $PATTERN"
    echo "Run without arguments to see available patterns."
    exit 1
    ;;
esac
