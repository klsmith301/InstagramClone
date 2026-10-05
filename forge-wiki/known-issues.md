# Known Issues

## TODO and FIXME Comments

No TODO or FIXME comments found in the codebase.

---

## Test Status

### Passing Tests

- **Frontend Save component tests** (`frontend/components/main/add/__tests__/Save.test.js`): Character count feature validation (4 test cases)
  - Confirms `charCount` style definition
  - Verifies character count rendering
  - Validates caption state and handler
  - Checks visual styling (right-aligned, secondary color)

### No Failing or Skipped Tests

All test suites that exist are expected to pass. No tests with `xit()`, `xtest()`, `skip()`, `xdescribe()` found.

---

## Documented Limits and Constraints

### Video Recording

**Max duration**: 60 seconds per video recording (`frontend/components/main/add/Camera.js`)

```javascript
const options = { maxDuration: 60, quality: Camera.Constants.VideoQuality['480p'] }
```

**Rationale**: Typical social media short-form video constraint.

---

## Known Architectural Gaps

None explicitly documented in code comments, but observed from implementation:

### Missing Features (Not Stated as TODO)

1. **No caption character limit enforced** — Frontend displays character count in Save screen but imposes no validation. Backend does not limit caption field size.

2. **No explicit error handling strategy** — Upload failures set an error flag and show a Snackbar but do not provide detailed error messages.

3. **No offline support** — App relies entirely on real-time Firestore connectivity; no local persistence layer (e.g., Redux Persist).

4. **No account banning workflow** — `users.banned` field exists and is checked in `Main.js`, but no UI flow for admins to ban users exists in the admin panel.

5. **No message deletion** — Chat messages can be sent but not deleted or edited.

6. **No post editing** — Posts cannot be edited after creation, only deleted.

7. **Limited search functionality** — Search uses simple `where("username", ">=", keyword)` prefix matching; no full-text search or fuzzy matching.

### Platform-Specific Issues

1. **Android-only setup** — `frontend/app.json` includes Android-specific Google Services JSON file reference and package name but no indication of iOS testing/deployment automation.

2. **Push notification token errors not surfaced** — If `Notifications.getExpoPushTokenAsync()` fails, user is alerted but app continues without token (unlikely to receive notifications).

---

## External Dependency Notes

- **Firebase SDK version 8.2.3 (frontend)** — Relatively old (released ~2021); not latest. Compatibility with newer Firebase backends should be verified periodically.
- **Expo version ~42.0.3** — Older managed runtime; Expo recommended newer versions. App may face issues with new Expo features or breaking changes.
- **React 16.13.1** — Old version; Hooks are supported but some modern React patterns unavailable.

---

## Security Considerations (Not Bugs, But Noted)

1. **Firebase credentials embedded in frontend** — `frontend/App.js` contains Firebase config. This is standard practice for frontend apps but exposes API keys; reliance on Firestore rules is essential.

2. **Admin role check in Firestore rules** — Admin role is enforced only by checking existence of a document in `admin/{userId}` collection. No backend verification prevents a user from manually writing to that collection in theory (though write is denied by rules).

3. **No rate limiting** — Posts, likes, messages, and other actions not rate-limited on backend; potential for spam or abuse.

4. **No input sanitization** — User inputs (captions, chat messages, usernames) passed directly to Firestore without validation or sanitization for XSS/injection attacks.

---

## Unfinished or Placeholder Code

**Admin.js** (`admin/src/components/Admin.js`) — Empty file; likely intended for admin-only features but not implemented.

---

## No Performance Monitoring

No analytics or performance monitoring setup observed (no Firebase Analytics initialization, no custom metrics).

---

## Conclusion

The codebase has no explicit TODO/FIXME markers. Identified gaps are architectural omissions rather than tracked issues. The project is a functional prototype suitable for learning and demonstration but requires hardening for production use (error handling, input validation, offline support, user abuse prevention).
