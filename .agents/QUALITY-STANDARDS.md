# Quality Standards

## Gates
1. Requirements understood
2. Existing system inspected
3. Design and technical plan approved
4. Implementation complete
5. Automated checks pass
6. Manual UX/UI review passes
7. Accessibility review passes
8. Security review passes
9. Performance review passes
10. SEO/marketing review passes when relevant
11. Regression review passes
12. Production deployment approved
13. Post-deployment verification complete

## UI Release Gates

- Shared-shell consistency passes for public, authentication, error, and portal routes.
- Light and dark theme parity is verified; one-theme evidence is incomplete.
- Responsive evidence records the required route, theme, viewport, and interaction matrix from `UI-CONSISTENCY-STANDARDS.md`.
- Icon controls have contextual accessible names and stateful controls expose their state.

No agent should mark work complete before relevant gates pass.
