#!/usr/bin/env python3
"""
Comprehensive batch fix for ESLint errors
"""
import os
import re
from pathlib import Path

# Root directory
ROOT_DIR = Path("/d/parscade/Parscade-Latest/Parscade-React-Frontend")
SRC_DIR = ROOT_DIR / "src"

def fix_unused_catch_variables(content):
    """Remove variable names from catch blocks to fix unused errors"""
    # Replace catch (error), catch (err), catch (e) with catch
    content = re.sub(r'} catch \([^)]+\) {', '} catch {', content)
    return content

def fix_unused_function_params(content):
    """Prefix unused function parameters with underscore"""
    # Common patterns for unused params reported by ESLint
    patterns = [
        # Map callbacks with unused index
        (r'\.map\(([^,]+), index\)', r'.map(\1, _index)'),
        (r'\.map\(\(([^,]+), index\)', r'.map((\1, _index)'),

        # Function params that are unused but reported
        (r'(\w+): ([^,\)]+)(?=.*?Allowed unused args must match)', r'_\1: \2'),
    ]

    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)

    return content

def fix_any_types(content):
    """Replace 'any' types with more specific types"""
    replacements = [
        # Record types
        (r': Record<string, any>', r': Record<string, unknown>'),
        # Array types
        (r': any\[\]', r': unknown[]'),
        # Function params
        (r'\(([^:]+): any\)', r'(\1: unknown)'),
        # Type assertions
        (r' as any(?=[,;\s\)])', r' as unknown'),
        # Generic any
        (r'<any>', r'<unknown>'),
        # Status type assertions (common pattern)
        (r'status as any', r"status as 'active' | 'inactive' | 'error' | 'pending'"),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    return content

def remove_unused_imports(content):
    """Remove commonly unused imports"""
    lines = content.split('\n')
    new_lines = []

    # Track what's actually used in the file (simplified check)
    used_identifiers = set(re.findall(r'\b[A-Z][a-zA-Z0-9_]*\b', content))

    for line in lines:
        # Skip lines with clearly unused imports
        if 'import' in line:
            skip_imports = [
                'DialogContent', 'DialogDescription', 'DialogHeader', 'DialogTitle',
                'Copy', 'Phone', 'useToast', 'AnimatePresence', 'FileText',
                'ArrowRight', 'TrendingUp', 'Settings', 'Plus', 'MoreVertical',
                'AlertTriangle', 'UserMinus', 'UserCheck', 'UserPlus', 'Filter',
                'Database', 'Code', 'Server', 'Globe', 'RotateCcw', 'Calendar',
                'Clock', 'RefreshCw', 'CheckCircle', 'Send', 'ArrowUp', 'Users',
                'StopCircle', 'Upload', 'AlertCircle', 'BarChart3', 'Download'
            ]

            should_skip = False
            for unused in skip_imports:
                if unused in line and unused not in used_identifiers:
                    # Check if this import is the only one on the line
                    if re.match(rf"^\s*import\s+.*{{\s*{unused}\s*}}", line):
                        should_skip = True
                        break
                    # Remove just this import from multi-import line
                    line = re.sub(rf',?\s*{unused}\s*,?', '', line)
                    # Clean up double commas
                    line = re.sub(r',,+', ',', line)
                    line = re.sub(r'{,', '{', line)
                    line = re.sub(r',}', '}', line)

            if should_skip:
                continue

        new_lines.append(line)

    return '\n'.join(new_lines)

def fix_unused_variables(content):
    """Fix unused variable assignments"""
    # Common unused variable patterns
    patterns = [
        # Remove unused state setters (be careful with this)
        (r'const \[[^,]+, set\w+\] = useState.*?null\);', ''),

        # Prefix unused destructured variables with underscore
        (r'const { ([^}]+) } = use\w+\(\);.*?is assigned a value but never used',
         lambda m: f"const {{ _{m.group(1)} }} = use{m.group(1)}();"),
    ]

    for pattern, replacement in patterns:
        if callable(replacement):
            content = re.sub(pattern, replacement, content)
        else:
            content = re.sub(pattern, replacement, content)

    return content

def replace_console_with_logger(content, filepath):
    """Replace console statements with logger"""
    # Skip if it's the logger file itself
    if 'logger.ts' in str(filepath):
        return content

    if not re.search(r'console\.(log|error|warn|debug)', content):
        return content

    # Check if logger is imported
    has_logger_import = "from '@/shared/services/logger'" in content

    # Replace console statements
    content = re.sub(r'console\.log\(', 'logger.info(', content)
    content = re.sub(r'console\.error\(', 'logger.error(', content)
    content = re.sub(r'console\.warn\(', 'logger.warn(', content)
    content = re.sub(r'console\.debug\(', 'logger.debug(', content)

    # Add logger import if needed
    if not has_logger_import and 'logger.' in content:
        lines = content.split('\n')
        import_inserted = False

        for i, line in enumerate(lines):
            if line.startswith('import ') and not import_inserted:
                lines.insert(i, "import { logger } from '@/shared/services/logger';")
                import_inserted = True
                break

        content = '\n'.join(lines)

    return content

def process_file(filepath):
    """Process a single TypeScript/TSX file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Apply fixes
        content = fix_unused_catch_variables(content)
        content = fix_unused_function_params(content)
        content = fix_any_types(content)
        content = remove_unused_imports(content)
        content = fix_unused_variables(content)
        content = replace_console_with_logger(content, filepath)

        # Write back if changed
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Process all TypeScript files"""
    fixed_count = 0

    # Process all TypeScript files
    for ext in ['*.ts', '*.tsx']:
        for filepath in SRC_DIR.rglob(ext):
            if process_file(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath.relative_to(ROOT_DIR)}")

    print(f"\n[FIXED] {fixed_count} files")

    # Also fix vitest.config.ts import issue
    vitest_config = ROOT_DIR / "vitest.config.ts"
    if vitest_config.exists():
        with open(vitest_config, 'r') as f:
            content = f.read()

        # Fix the import path for vitest
        content = content.replace("from 'vitest/config'", "from 'vite'")
        content = content.replace("import { defineConfig } from 'vite'", "import { defineConfig } from 'vite'")

        with open(vitest_config, 'w') as f:
            f.write(content)
        print("[FIXED] vitest.config.ts import")

    print("\n[COMPLETE] Batch fixes complete!")

if __name__ == "__main__":
    main()