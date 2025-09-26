#!/usr/bin/env python3
"""
Batch fix ESLint errors in the React frontend codebase
"""
import os
import re
from pathlib import Path
import json

# Get the src directory
SRC_DIR = Path("/d/parscade/Parscade-Latest/Parscade-React-Frontend/src")

def fix_console_statements(content, filepath):
    """Replace console.log statements with logger service calls"""

    # Skip logger.ts itself
    if 'logger.ts' in str(filepath):
        return content

    # Check if logger is already imported
    has_logger_import = "import { logger }" in content or "from '@/shared/services/logger'" in content

    # Replace console statements
    replacements = [
        (r'console\.log\((.*?)\);', r'logger.info(\1);'),
        (r'console\.error\((.*?)\);', r'logger.error(\1);'),
        (r'console\.warn\((.*?)\);', r'logger.warn(\1);'),
        (r'console\.debug\((.*?)\);', r'logger.debug(\1);'),
    ]

    changed = False
    for pattern, replacement in replacements:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            changed = True

    # Add logger import if needed and file was changed
    if changed and not has_logger_import:
        # Find the last import statement
        import_lines = []
        other_lines = []
        in_imports = True

        for line in content.split('\n'):
            if in_imports and (line.startswith('import ') or line.startswith('from ') or line.strip() == ''):
                import_lines.append(line)
            else:
                in_imports = False
                other_lines.append(line)

        # Add logger import
        import_lines.append("import { logger } from '@/shared/services/logger';")
        import_lines.append("")

        content = '\n'.join(import_lines + other_lines)

    return content

def fix_any_types(content):
    """Replace 'any' types with proper types where possible"""

    # Common any type replacements
    replacements = [
        # Error catch blocks
        (r'} catch \(error\) {', r'} catch {'),
        (r'} catch \(err\) {', r'} catch {'),
        (r'} catch \(e\) {', r'} catch {'),

        # Common any type patterns
        (r': any\[\]', r': unknown[]'),
        (r': Record<string, any>', r': Record<string, unknown>'),
        (r'<any>', r'<unknown>'),
        (r' as any([,;\s\)])', r' as unknown\1'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    return content

def fix_unused_variables(content):
    """Prefix unused variables with underscore or remove them"""

    # Common unused variable patterns
    replacements = [
        # Unused function parameters - prefix with underscore
        (r'(\w+): ([^,\)]+)(?=.*?Allowed unused args must match)', r'_\1: \2'),

        # Remove unused imports (conservative - only obvious ones)
        (r'^import \{ [^}]*?(Copy|DialogContent|DialogDescription|DialogHeader|DialogTitle)[^}]*? \} from.*?dialog.*?$', ''),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

    # Remove empty import statements
    content = re.sub(r'^import \{ *\} from.*?$\n', '', content, flags=re.MULTILINE)

    return content

def fix_import_order(content):
    """Fix import order issues"""

    lines = content.split('\n')
    import_groups = {
        'react': [],
        'external': [],
        'internal': [],
        'relative': [],
        'type': []
    }

    other_lines = []
    in_imports = True

    for line in lines:
        if in_imports and line.strip().startswith('import '):
            # Categorize import
            if 'react' in line and 'react-' not in line:
                import_groups['react'].append(line)
            elif line.startswith('import type '):
                import_groups['type'].append(line)
            elif '@/' in line:
                import_groups['internal'].append(line)
            elif './' in line or '../' in line:
                import_groups['relative'].append(line)
            else:
                import_groups['external'].append(line)
        elif in_imports and (line.strip() == '' or not line.strip().startswith('import')):
            if line.strip() != '':
                in_imports = False
                other_lines.append(line)
        else:
            other_lines.append(line)

    # Rebuild with proper order
    new_lines = []

    # Add imports in order
    for group in ['react', 'external', 'internal', 'relative', 'type']:
        if import_groups[group]:
            new_lines.extend(sorted(import_groups[group]))
            new_lines.append('')  # Empty line between groups

    # Remove last empty line if exists
    if new_lines and new_lines[-1] == '':
        new_lines.pop()

    new_lines.append('')  # Empty line after imports
    new_lines.extend(other_lines)

    return '\n'.join(new_lines)

def process_file(filepath):
    """Process a single file to fix lint errors"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Apply fixes
        content = fix_console_statements(content, filepath)
        content = fix_any_types(content)
        content = fix_unused_variables(content)
        content = fix_import_order(content)

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
    """Main function to process all TypeScript/JavaScript files"""

    fixed_count = 0
    error_count = 0

    # Process all .ts, .tsx, .js, .jsx files
    for ext in ['*.ts', '*.tsx', '*.js', '*.jsx']:
        for filepath in SRC_DIR.rglob(ext):
            if process_file(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath.relative_to(SRC_DIR)}")

    print(f"\n✅ Fixed {fixed_count} files")

    # Run ESLint with auto-fix
    print("\n🔧 Running ESLint auto-fix...")
    os.system("cd /d/parscade/Parscade-Latest/Parscade-React-Frontend && npx eslint . --fix")

    print("\n✨ Batch fixes complete!")

if __name__ == "__main__":
    main()