# Claude Code Instructions

@AGENTS.md

## Before Starting

1. Read AGENTS.md.
2. Inspect the repository structure.
3. Read relevant files under docs/.
4. Check existing implementations before proposing new abstractions.

## Working Rules

- Follow all shared engineering standards.
- Do not rewrite unrelated code.
- Do not change architecture without explaining why.
- Ask before making destructive or high-impact changes.
- Prefer existing scripts over inventing new commands.

## Subagents

For complex tasks, consider delegating independent work such as:

- Architecture analysis
- Backend implementation review
- Frontend implementation review
- Test coverage review

The main agent is responsible for integrating and verifying all changes.
