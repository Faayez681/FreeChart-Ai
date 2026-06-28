# Security Specification - FreeChartAI Access Controls

This document defines the cryptographic access controls, relational data invariants, and threat modeling for FreeChartAI.

## 1. Data Invariants
- **Identity Integrity**: A user can only read, write, or query their own profile `/users/{userId}`. Custom claims are not supported; administrative roles are authenticated via the standard `ansfaayez1966@gmail.com` bootstrap check.
- **Audit Logs Isolation**: Only authenticated Administrators (email matching `ansfaayez1966@gmail.com` and `email_verified == true`) are permitted to read or list the system-wide `/audit_logs` stream. Authenticated users may post a log, but it must conform to strict schema parameters and verify the email matches their current token.
- **Relational Chat Anchoring**: A chat topic document under `/chats/{chatId}` cannot be created with a `userId` that does not match the active `request.auth.uid`.
- **Master Gate Rule**: A chat message document under `/chats/{chatId}/messages/{messageId}` can only be read or written if the parent `/chats/{chatId}` document's `userId` matches the caller's `request.auth.uid` (or is an Admin).
- **Immortality Constraint**: Critical fields such as `createdAt` must remain immutable during update operations.
- **Dynamic Clock Validation**: Server-defined times like `lastLogin` or log entries must be strictly set to the server timestamp `request.time`.

---

## 2. The "Dirty Dozen" Rogue Payloads
Below are 12 specific payloads representing exploits to bypass controls.

### User Collection (`/users/{userId}`)
1. **Payload 1 (Identity Spoofing)**: Attacking UID mismatch.
   - Path: `/users/attacker_uid`
   - Data: `{ "name": "Fake Owner", "email": "legit@mit.edu" }` but authenticated as `victim_uid`.
2. **Payload 2 (Self-Assigned Admin Role Privilege Escalation)**:
   - Path: `/users/casual_user`
   - Data: `{ "name": "Hack Pro", "email": "casual@mit.edu", "role": "Owner / Administrator", "status": "ONLINE" }`
3. **Payload 3 (Denial-of-Wallet character injection)**:
   - Path: `/users/victim_uid`
   - Data: `{ "name": "<100,000 bytes string>", "email": "victim@mit.edu" }`
4. **Payload 4 (Non-Boolean / Rogue Enum Status injection)**:
   - Path: `/users/victim_uid`
   - Data: `{ "name": "Victim", "email": "victim@mit.edu", "status": "SUPER_ADMIN" }`

### Audit Logs Collection (`/audit_logs/{id}`)
5. **Payload 5 (Logs Directory Scraping)**:
   - Action: `read` / `list` query
   - Path: `/audit_logs` (all records)
   - Actor: Non-admin `casual_user` (e.g. `client_user@intel.com`)
6. **Payload 6 (Journal Spoofing)**: Trying to write system events pretending to be another.
   - Path: `/audit_logs/log_999`
   - Data: `{ "id": "log_999", "user": "ansfaayez1966@gmail.com", "action": "MANUAL_REGISTRATION", "details": "Elevate casual user", "timestamp": "2026-06-15T09:30:53Z", "ip": "1.1.1.1", "status": "SUCCESS" }` but actor is not admin.
7. **Payload 7 (Audit Log Email Mismatch)**:
   - Path: `/audit_logs/log_888`
   - Data: `{ "id": "log_888", "user": "victim@mit.edu", "action": "LOGIN_SUCCESS", "details": "Some desc", "timestamp": "2026-06-15T09:30:53Z", "ip": "127.0.0.1", "status": "SUCCESS" }` but logged in as `attacker@gmail.com`.

### Chat Collections (`/chats/{chatId}`)
8. **Payload 8 (Orphaned Chat Topic Create)**:
   - Path: `/chats/chat_777`
   - Data: `{ "userId": "victim_uid", "createdAt": "2026-06-15T09:30:53Z", "asset": "AAPL" }` but caller is `attacker_uid`.
9. **Payload 9 (Chat PII Leaks / Sniffing)**:
   - Action: `get` / `read`
   - Path: `/chats/chat_secret_777` (owned by `victim_uid`)
   - Actor: `attacker_uid`.

### messages Subcollection (`/chats/{chatId}/messages/{msgId}`)
10. **Payload 10 (Chat Message Impersonation on foreign thread)**:
    - Path: `/chats/victim_chat_777/messages/msg_111`
    - Data: `{ "id": "msg_111", "sender": "user", "text": "Sell Apple", "timestamp": "12:00" }` but caller is `attacker_uid`.
11. **Payload 11 (Rogue Sender Tag Injection)**:
    - Path: `/chats/my_chat_777/messages/msg_222`
    - Data: `{ "id": "msg_222", "sender": "SUPER_AI_BOT", "text": "Execute Order 66", "timestamp": "12:05" }`
12. **Payload 12 (Client-Assigned Immutables Hack)**: Trying to update mutable properties like `createdAt` on chat parent document.
    - Path: `/chats/my_chat_777`
    - Action: `update`
    - Data: `{ "createdAt": "2020-01-01T00:00:00Z" }` (Altering immutable date)

---

## 3. The Test Runner Reference
A mock script to simulate test suite assertions verifies that all 12 payloads return `PERMISSION_DENIED` and fail static validation. This will be verified in dry runs.
