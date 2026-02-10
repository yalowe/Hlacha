# Security Notes

- Anonymous access is supported via `anon_session_id` fields; authenticated users rely on Firebase Auth.
- Rate limiting is enforced in Cloud Functions (minute bucket).
- Firestore rules enforce pending_review for new questions and staff-only approvals.
- All user-submitted text is sanitized in Cloud Functions.
- Audit logs are written by functions for approvals and moderation.
- Use HTTPS and protect service accounts for admin operations.
