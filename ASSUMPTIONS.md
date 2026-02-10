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
