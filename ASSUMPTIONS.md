# Assumptions

- Prisma/Postgres implementation and migrations were removed in favor of Firebase-only v1.
- A root package.json was added to run Firebase emulators and rules tests.
- Firebase callable functions rely on auth token custom claims for `role` (Posek/SuperAdmin/Editor).
- The legacy server folder is kept as a minimal health-only placeholder; all data operations use Firebase.
- Screenshot of the "שאלה חדשה" screen was not captured in this environment; needs manual capture.
- Firebase emulators were executed via `npm run emu:ci` locally; emulator warnings about Java Unsafe and Node version surfaced but tests still passed.
- Firebase CLI login is expected to be performed in local dev/CI separately; emulator run was unauthenticated here.
- Java emulator warnings about deprecated Unsafe/native access are treated as non-blocking.
- `ts-prune` requires a project path (`-p kitzur/tsconfig.json`) and reports Expo Router default exports as unused; those are retained.
- `waitForApprovedAnswer` in tests supports an object payload so it can poll answers stored under `questions/{questionId}/answers/{answerId}`, matching the callable function behavior.
- `.env` and `.env.development` were missing; created with placeholder `EXPO_PUBLIC_ADMIN_SECRET_CODE=dev-admin` and `EXPO_PUBLIC_EMULATOR_HOST=127.0.0.1` to satisfy Expo env loading.
- `kitzur/firebase/firebaseConfig.ts` does not exist; firebase config validation used `kitzur/src/firebase.ts` instead.
