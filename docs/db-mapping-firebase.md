# Firebase DB Mapping (v1)

## Collections

### questions
- id
- title
- body
- status: pending_review | approved | locked | rejected
- visibility: public | private
- tags: string[]
- slug
- contentHash
- anon_session_id
- asked_by_user_id
- createdAt / updatedAt

### questions/{questionId}/answers
- id
- body
- status: draft | approved | locked
- posek_user_id
- approved_by_user_id
- createdAt / approvedAt
- version

### answer_submissions
- id
- questionId
- text
- sources
- respondedBy
- status: pending_review
- anon_session_id
- createdAt

### questions/{questionId}/sources
- id
- type: primary | secondary | tertiary
- rank
- text
- link
- status

### questions/{questionId}/discussions
- id
- thread_id
- type: question | kushya | source | clarification
- body
- status
- createdAt
- editedAt / editedBy

### questions/{questionId}/examples
- id
- context: home | work | hosting | travel
- body
- linked_clause
- status

### glossary
- id
- term
- short_definition
- status

### glossary/{glossaryId}/pronunciations
- id
- dialect: sephardi | ashkenazi
- audio_url
- status

### links
- id
- question_id
- target_type: question | topic | series
- target_id
- reason
- status

### revisions
- id
- entity_type
- entity_id
- changed_by
- change_summary
- diff_json
- createdAt

### donations
- id
- amount
- currency
- payment_reference
- topic_id / series_id
- status: pending | in_study | completed | canceled
- anon_session_id

### audit_logs
- id
- actor_user_id
- action
- entity_type
- entity_id
- metadata_json
- createdAt

### moderation_flags
- id
- entity_type
- entity_id
- reason
- status
- resolved_at / resolved_by / resolution_note

### notifications
- id
- user_id
- type
- payload_json
- read_at
- createdAt
