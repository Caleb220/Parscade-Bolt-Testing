#!/bin/bash

# Fix default imports for ParscadeButton
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeButton } from '@/shared/components/brand/ParscadeButton'|import ParscadeButton from '@/shared/components/brand/ParscadeButton'|g" {} \;

# Fix default imports for ParscadeCard
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeCard } from '@/shared/components/brand/ParscadeCard'|import ParscadeCard from '@/shared/components/brand/ParscadeCard'|g" {} \;

# Fix default imports for ParscadeStatusBadge
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeStatusBadge } from '@/shared/components/brand/ParscadeStatusBadge'|import ParscadeStatusBadge from '@/shared/components/brand/ParscadeStatusBadge'|g" {} \;

# Fix default imports for ParscadeLoadingState
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeLoadingState } from '@/shared/components/brand/ParscadeLoadingState'|import ParscadeLoadingState from '@/shared/components/brand/ParscadeLoadingState'|g" {} \;

# Fix default imports for ParscadeMetric
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeMetric } from '@/shared/components/brand/ParscadeMetric'|import ParscadeMetric from '@/shared/components/brand/ParscadeMetric'|g" {} \;

# Fix default imports for ParscadeDropdown
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeDropdown } from '@/shared/components/brand/ParscadeDropdown'|import ParscadeDropdown from '@/shared/components/brand/ParscadeDropdown'|g" {} \;

# Fix default imports for ParscadeInput
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeInput } from '@/shared/components/brand/ParscadeInput'|import ParscadeInput from '@/shared/components/brand/ParscadeInput'|g" {} \;

# Fix default imports for ParscadeToggle
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeToggle } from '@/shared/components/brand/ParscadeToggle'|import ParscadeToggle from '@/shared/components/brand/ParscadeToggle'|g" {} \;

# Fix default imports for ParscadeTabs
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeTabs } from '@/shared/components/brand/ParscadeTabs'|import ParscadeTabs from '@/shared/components/brand/ParscadeTabs'|g" {} \;

# Fix default imports for ParscadeTable
find src -type f -name "*.tsx" -exec sed -i "s|import { ParscadeTable } from '@/shared/components/brand/ParscadeTable'|import ParscadeTable from '@/shared/components/brand/ParscadeTable'|g" {} \;

echo "Default import fixes completed!"