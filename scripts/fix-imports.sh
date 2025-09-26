#!/bin/bash

# Fix imports for ParscadeButton
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeButton'|from '@/shared/components/brand/ParscadeButton'|g" {} \;

# Fix imports for ParscadeCard
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeCard'|from '@/shared/components/brand/ParscadeCard'|g" {} \;

# Fix imports for ParscadeStatusBadge
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeStatusBadge'|from '@/shared/components/brand/ParscadeStatusBadge'|g" {} \;

# Fix imports for ParscadeLoadingState
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeLoadingState'|from '@/shared/components/brand/ParscadeLoadingState'|g" {} \;

# Fix imports for ParscadeMetric
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeMetric'|from '@/shared/components/brand/ParscadeMetric'|g" {} \;

# Fix imports for ParscadeDropdown
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeDropdown'|from '@/shared/components/brand/ParscadeDropdown'|g" {} \;

# Fix imports for ParscadeInput
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeInput'|from '@/shared/components/brand/ParscadeInput'|g" {} \;

# Fix imports for ParscadeToggle
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeToggle'|from '@/shared/components/brand/ParscadeToggle'|g" {} \;

# Fix imports for ParscadeTabs
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeTabs'|from '@/shared/components/brand/ParscadeTabs'|g" {} \;

# Fix imports for ParscadeTable
find src -type f -name "*.tsx" -exec sed -i "s|from '@/shared/components/ParscadeTable'|from '@/shared/components/brand/ParscadeTable'|g" {} \;

echo "Import fixes completed!"