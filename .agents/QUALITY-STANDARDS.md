# Quality Standards

## Gates
1. Requirements understood
2. Existing system and `.agents/PRODUCTION-ARCHITECTURE.md` inspected
3. Design and technical plan approved
4. Implementation complete
5. Lint/build and relevant automated checks pass
6. Role-based Admin/Client/Developer workflow review passes for every affected CRUD capability
7. Successful mutations survive navigation, refresh, logout/login, and a fresh session where applicable
8. File workflows verify upload, render/download, authorization boundaries, replacement, and deletion
9. Loading, empty, success, 401, 403, 404, 409, and server-error states are coherent for affected screens
10. Manual UX/UI review passes in light and dark themes
11. Responsive review passes for desktop, tablet, and mobile
12. Accessibility review passes
13. Security/API-boundary review passes; no Google/provider secrets exist in browser code
14. Performance review passes
15. SEO/marketing review passes when relevant
16. Regression review passes
17. Production deployment approved
18. Post-deployment changed-workflow verification complete

A green lint/build is necessary but not sufficient evidence that portal CRUD works.

No agent should mark work complete before relevant gates pass.
