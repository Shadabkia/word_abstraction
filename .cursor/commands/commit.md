Create a git commit following conventional commit standards:

## Conventional Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code style (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding/updating tests
- **chore**: Maintenance (deps, config, etc.)
- **perf**: Performance improvement

## Scopes (examples)
- `word-connect`: Word Connect game
- `arcade`: Arcade screen/system
- `feed`: Feed feature
- `profile`: Profile feature
- `ui`: UI components
- `core`: Core systems
- `build`: Build system
- `tooling`: Dev tools/scripts

## Workflow

1. **Check status**: `git status --short`
2. **Stage files**: `git add <files>` (exclude DEBUG_MODE changes!)
3. **Commit**: Follow conventional format with clear, descriptive message
4. **Include**:
   - What changed (bullet points)
   - Why it changed
   - Impact/results
   - Any breaking changes or resolutions

## Example

```
fix(word-connect): resolve level validation errors

- Add meta_group tiles to transform groups
- Redistribute revealed tiles to prevent chain reactions
- Fix validator path resolution

Validation results:
- All checks: ✅ Pass
- Solvability: ✅ 8 steps

Resolves validation errors in level45
```

## Important
⚠️ **Never commit**: DEBUG_MODE changes, temp files, or unfinished work
✅ **Always commit**: Completed features, fixes, and related documentation

