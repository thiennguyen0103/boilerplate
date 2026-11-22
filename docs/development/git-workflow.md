# Git Workflow

## Branching

Use short-lived branches for individual changes.

Suggested naming:

```text
feature/<short-description>
fix/<short-description>
refactor/<short-description>
docs/<short-description>
chore/<short-description>
```

## Commits

Use Conventional Commits where configured.

Examples:

```text
feat: add user registration
fix: handle expired sessions
refactor: simplify user repository
docs: update backend architecture
test: add user use case tests
chore: update dependencies
```

## Pull Requests

A pull request should include:

- Purpose and scope.
- Summary of changes.
- Relevant tests.
- Screenshots for UI changes where useful.
- Migration notes where applicable.
- Known limitations.

## Review

- Keep changes focused.
- Address security concerns.
- Verify tests and linting.
- Update documentation when necessary.
