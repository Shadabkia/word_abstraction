Create a git commit following **Conventional Commits v1.0.0** specification:

## Format Structure

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

## Header Rules
- **description**: Lowercase, imperative mood ("add" not "added"), no period, ≤50 chars
- **type**: Required, lowercase (see types below)
- **scope**: Optional, noun describing section of codebase
- **!**: Optional, indicates breaking change (alternative to footer)

## Types (Required)
- **feat**: New feature (triggers MINOR version bump)
- **fix**: Bug fix (triggers PATCH version bump)
- **docs**: Documentation only changes
- **style**: Code style (formatting, semicolons, no code change)
- **refactor**: Code change that neither fixes bug nor adds feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **build**: Build system or external dependencies (webpack, npm, etc.)
- **ci**: CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

## Scopes (Project-Specific)
- `word-connect`: Word Connect game
- `arcade`: Arcade screen/system
- `feed`: Feed feature
- `messages`: Messages feature
- `profile`: Profile feature
- `dashboard`: Dashboard feature
- `ui`: UI components
- `core`: Core systems
- `api`: API layer
- `build`: Build system
- `tooling`: Dev tools/scripts

## Body Rules
- Optional, use to explain **what** and **why**, not **how**
- Blank line after header (required if body exists)
- Free-form, can use bullet points (-, *, •)
- Wrap at 72 characters per line

## Footer Rules
- Optional, one or more footers (blank line before footer)
- Format: `<token>: <value>` or `<token> #<value>`
- Common tokens:
  - `BREAKING CHANGE:` - describes breaking change (triggers MAJOR bump)
  - `Closes:` or `Fixes:` - references issue(s) closed
  - `Refs:` - references related issue(s)
  - `Co-authored-by:` - credits co-authors

## Breaking Changes
Two ways to indicate breaking changes:
1. Add `!` after type/scope: `feat(api)!: remove deprecated endpoints`
2. Add footer: `BREAKING CHANGE: <description>`

## Workflow

1. **Check status**: `git status --short`
2. **Stage files**: `git add <files>` (⚠️ exclude DEBUG_MODE changes!)
3. **Write commit**: Follow format above
4. **Commit**: `git commit -m "..."`

## Examples

### Simple fix
```
fix(word-connect): correct tile matching logic
```

### Feature with body
```
feat(arcade): add level unlock progression

- Implement chapter-based unlock system
- Add progress tracking per game
- Include visual unlock indicators

Closes: #42
```

### Breaking change
```
feat(api)!: redesign level data structure

BREAKING CHANGE: Level JSON format has changed. Old levels must be migrated using the migration script.

Refs: #123
```

### Multiple footers
```
fix(ui): resolve button alignment in RTL mode

Fixes: #234
Refs: #190
Co-authored-by: Jane Doe <jane@example.com>
```

## Best Practices
✅ **Always commit**: Completed features, fixes, and related docs
✅ **Use imperative mood**: "add" not "added", "fix" not "fixed"
✅ **Keep header short**: ≤50 chars for better readability
✅ **Reference issues**: Use `Closes:` or `Refs:` in footer

⚠️ **Never commit**: DEBUG_MODE changes, temp files, unfinished work, secrets
⚠️ **Avoid vague messages**: "fix stuff", "update code", "changes"

## References
- Specification: https://www.conventionalcommits.org/
- Semantic Versioning: https://semver.org/

