# Ui Redesign Workflow

## Purpose
Use for visual changes. Inspect current design system first, define scope, review with UI/UX/content/accessibility, test responsive breakpoints, avoid unrelated rewrites.

## Required Steps
1. Confirm objective, scope, and out-of-scope.
2. Inventory shell ownership, theme tokens, shared primitives, and affected routes before editing.
3. Select relevant agents through the Orchestrator.
4. Apply security, accessibility, performance, and trust checks.
5. Require QA/regression review for development work.
6. Implement through shared tokens and components; reject page-local copies of headers, footers, theme controls, or glass recipes.
7. Review both themes and the responsive matrix in `../UI-CONSISTENCY-STANDARDS.md`.
8. Document decisions, tests, risks, and handoff.

## Required Review Gates
- Requirements understood
- Existing system inspected
- Plan approved when needed
- Implementation or recommendation complete
- Relevant automated and manual checks complete
- Security review before deployment
- Final handoff complete

## Stop Conditions
Stop for approval if the workflow requires destructive action, production deployment, secret access, major architecture changes, unsupported claims, or ambiguous scope.
