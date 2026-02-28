#!/bin/bash

echo "=== Finding ButtonLegacy imports ==="
grep -r "ButtonLegacy" src/ --include="*.tsx" --include="*.ts" | grep "import"

echo ""
echo "=== Count of files using ButtonLegacy ==="
grep -r "ButtonLegacy" src/ --include="*.tsx" --include="*.ts" | grep "import" | wc -l

echo ""
echo "=== Finding Button component usage from ButtonLegacy ==="
grep -r "from.*ButtonLegacy" src/ --include="*.tsx" --include="*.ts"
