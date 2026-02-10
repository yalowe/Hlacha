# API Contract (v1 - Firebase)

## Firestore Collections
- `questions` (pending_review/approved/locked/rejected)
- `questions/{questionId}/answers`
- `questions/{questionId}/discussions`
- `moderation_flags`
- `audit_logs`

## Cloud Functions (callable)

### approveAnswer
Approves an answer (Posek/SuperAdmin only).

Payload:
```json
{
  "questionId": "string",
  "answerId": "string"
}
```

### createFlag
Creates moderation flag.

Payload:
```json
{
  "entity_type": "question|answer|discussion",
  "entity_id": "string",
  "reason": "string",
  "anon_session_id": "string"
}
```

### resolveFlag
Resolves moderation flag (Editor/SuperAdmin).

Payload:
```json
{
  "flag_id": "string",
  "resolution_note": "string"
}
```
