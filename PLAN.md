# Learning Platform V1 Plan

## Scope -> Deliverables -> Owners -> Risks -> Mitigations
| Scope | Deliverables | Owners | Risks | Mitigations |
| --- | --- | --- | --- | --- |
| DB + rules | Firestore rules, indexes, functions triggers | Backend | Rules too strict/loose | Emulator tests + gradual rollout |
| API layer | Firebase Functions (callable + triggers) | Backend | Unauthorized access | RBAC via claims + rules |
| Q/A flow | Question submit, answer approval pipeline | Mobile + Backend | Auto-publish violations | Enforce approved-only responses |
| Discussion | Typed discussion items, moderation | Mobile + Backend | Halachic decision in discussion | Enforce type + moderation |
| Examples | Structured examples by context | Mobile + Backend | Example contradicts answer | Link to clause + review |
| Glossary + audio | Terms, definitions, pronunciation | Mobile + Backend | Missing audio | Fallback UI + queue |
| Donations | Donation -> topic/series tracking | Mobile + Backend | Donation implies psak | Messaging + status labels |
| Admin tools | Role mgmt, approvals, audit log | Mobile + Backend | Privilege escalation | Audit + least privilege |
| Tests | Unit, permission, edge cases, E2E skeleton | QA | Low coverage | Gates + CI checks |

## Commit Plan
1) chore: add plan and specs
2) test: add unit + permission test skeletons
3) backend: add DB schema + migrations
4) backend: add API endpoints + validation
5) mobile: add question/answer flow updates
6) mobile: add discussion, examples, glossary UI
7) mobile: add donations + status UI
8) qa: add E2E skeleton and smoke suite

## PR
feature/learning-platform-v1

## Quality Loop (5 iterations)
1) Schema and API review
2) Permissions and moderation review
3) UI flow review for partial content
4) Load/edge testing review
5) Final regression + E2E smoke
