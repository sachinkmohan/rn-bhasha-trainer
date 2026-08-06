# Google Sign-In on Expo SDK 54: library, credentials, and the two-variant problem

Research for [#26](https://github.com/sachinkmohan/rn-bhasha-trainer/issues/26) (part of map [#23](https://github.com/sachinkmohan/rn-bhasha-trainer/issues/23)).
Researched 2026-08-06 against primary sources only (docs.expo.dev, supabase.com/docs, react-native-google-signin.github.io, developer.android.com / support.google.com, and the published npm package source).

Scope: **Android only** (iOS is out of scope per #23), **Supabase** as the auth backend, **Google Sign-In only**.

---

## 1. Answer in short

- Use **`@react-native-google-signin/google-signin`** (currently `16.1.4`), the **"Original Google Sign In"** module (the free tier), and hand its `idToken` to `supabase.auth.signInWithIdToken({ provider: 'google', token })`. This is exactly what Supabase's own React Native docs prescribe.
- **Do not** use `expo-auth-session` — Expo's own SDK reference now deprecates its Google provider and points at `@react-native-google-signin/google-signin`.
- It **cannot run in Expo Go** (native code). The existing dev client **must be rebuilt** after the dependency is added.
- **No config plugin is needed for this app right now.** Proven from the plugin's source: in the non-Firebase mode it only appends an iOS URL scheme, and it *throws* if `iosUrlScheme` is absent. Android-only + no Firebase ⇒ omit the plugin entirely; autolinking is sufficient.
- **OAuth clients needed: 1 Web + 3 Android = 4.** The three Android clients are one per distinct (package name, SHA-1) pair: dev package/EAS dev keystore, prod package/EAS upload keystore, prod package/Play App Signing key.
- **`app.config.ts` needs no per-variant Google config.** Android OAuth client IDs are never passed in JS — only the single Web client ID is, and it is shared by both variants. The variant switching problem is entirely a Google Cloud Console registration problem, not a code problem.

---

## 2. Library choice

### Supabase's recommendation

Supabase's Google auth guide, React Native platform tab:

> "When working with Expo, you can use the `@react-native-google-signin/google-signin` library to obtain an ID token that you can pass to supabase-js `signInWithIdToken` method."

> "You have to create OAuth client IDs for both a Web and Android application. **The Web client ID is the one used in your Android app.**"

Supabase shows no `expo-auth-session` path for React Native at all.
Source: <https://supabase.com/docs/guides/auth/social-login/auth-google> (React Native tab).

### Expo's position

- `expo-auth-session` SDK reference carries a deprecation notice on the Google provider: *"Where available, we recommend using a library supplied by your identity provider… For example, use `@react-native-google-signin/google-signin` for Google authentication."* `GoogleAuthRequestConfig` is marked **Deprecated**.
  Source: <https://docs.expo.dev/versions/latest/sdk/auth-session/>
- Expo's Google authentication guide lists **two** acceptable libraries: `react-native-nitro-google-signin` and `@react-native-google-signin/google-signin`, and notes *"These libraries can't be used in Expo Go because they require custom native code."*
  Source: <https://docs.expo.dev/guides/google-authentication/>

### Why not the alternatives

| Option | Verdict | Why |
| --- | --- | --- |
| `expo-auth-session` (`providers/Google`) | Rejected | Deprecated by Expo for Google; browser-redirect flow, worse UX, and Supabase documents no path for it. |
| `@react-native-google-signin/google-signin` — **Original** module | **Chosen** | Free, MIT-tier, Supabase-documented, mature, RN 0.76–0.86 / Expo 52.0.40–57 support. |
| `@react-native-google-signin/google-signin` — One Tap / Credential Manager module | Rejected for now | *"The functionality covered in this page is available in the licensed version"* — paid. (<https://react-native-google-signin.github.io/docs/one-tap>) |
| `react-native-nitro-google-signin` | Hold, revisit | MIT, free, wraps **Android Credential Manager** (the API Google is steering everyone to), requires `react-native-nitro-modules` and RN 0.76+ (new arch — which this app has). But the package was first published **2026-06-01** — roughly two months old at time of writing. Too green for a live Play Store app on a first auth integration. |

### The deprecation caveat (real, but not blocking)

Google's own docs:

> "Google Sign-In for Android (as part of `com.google.android.gms:play-services-auth`) is deprecated and will be removed from the Google Play services Auth SDK in a future release."
> — <https://developer.android.com/identity/sign-in/legacy-gsi-migration>

Expo repeats this: *"The legacy Google Sign-In SDK for Android… is deprecated and Google recommends migrating to Android Credential Manager."*

**No concrete removal date is published on that page.** The Original module keeps working today, and the migration path (Credential Manager) is a swap of the sign-in call, not of the credential setup — the OAuth clients and SHA-1 work documented below is identical either way. Treat this as a known future migration, and note it in the ADR rather than letting it block the first release.

---

## 3. Version compatibility (SDK 54, RN 0.81.5, new architecture)

From the library's install page (<https://react-native-google-signin.github.io/docs/install>):

- Supported: **`expo` 52.0.40 – 57**, **`react-native` 0.76.0 – 0.86**.
- *"both old and new architecture of React Native are supported."*
- Requires `compileSdkVersion` ≥ 35 and `kotlinVersion` ≥ 2.0.21; **"Expo SDK 53+ already meets these requirements"** — so no `expo-build-properties` is needed here.

npm metadata for `@react-native-google-signin/google-signin@16.1.4`: `peerDependencies: { expo: ">=52.0.40", react: "*", react-native: "*" }`.

**This app**: `expo ~54.0.34`, `react-native 0.81.5`, `newArchEnabled: true`, `jsEngine: "hermes"`. All inside the supported ranges. ✅

`reactCompiler: true` — no interaction found in any primary source. The React Compiler operates on this app's own components; the library ships a native module plus a small JS surface. No documented incompatibility, and none expected. Flagged in §9 as unverified rather than confirmed.

---

## 4. Expo Go and the dev client

- Expo Go: **not supported.** *"This package cannot be used in Expo Go because it uses native code."* (<https://react-native-google-signin.github.io/docs/setting-up/expo>)
- The app already depends on `expo-dev-client ~6.0.21`, and `eas.json` has a `development` profile with `developmentClient: true` and `APP_VARIANT=development`.
- **The existing dev client must be rebuilt.** Adding a new native module changes the native binary; the installed dev client APK does not contain the module. Run `eas build --profile development --platform android` again after installing the dependency.
- Once rebuilt, `npm run dev` (which sets `APP_VARIANT=development`) continues to work unchanged.

---

## 5. Config plugin: not required for this app

The Expo setup page shows a plugin entry with a required `iosUrlScheme`:

```json
["@react-native-google-signin/google-signin", { "iosUrlScheme": "com.googleusercontent.apps._some_id_here_" }]
```

Reading the shipped plugin source (`plugin/build/withGoogleSignIn.js` in the published 16.1.4 tarball) settles what the docs leave ambiguous:

- Non-Firebase mode (`withGoogleSignInWithoutFirebase`) runs exactly one mod: `withGoogleUrlScheme`, an `withInfoPlist` mod. **It touches nothing on Android.**
- `validateOptions` **throws** if `iosUrlScheme` is missing or does not start with `com.googleusercontent.apps.`.
- Firebase mode (plugin entry with *no* options object) applies the `google-services.json` classpath/plugin mods — only relevant if you adopt Firebase, which this effort does not.

**Conclusion:** for Android-only, non-Firebase, **omit the plugin from `app.config.ts`**. Adding it with a fake `iosUrlScheme` buys nothing and adding it without options would switch it into Firebase mode and demand a `google-services.json`. Add the plugin with a real `iosUrlScheme` if and when iOS comes back into scope (~Oct 2026 per #23).

---

## 6. Android credentials: the OAuth client math

### The rule

Google requires, for an OAuth client of type **Android**:

> "You need to specify your Android app's package name and SHA1 fingerprint."
> — <https://support.google.com/cloud/answer/6158849>

So an Android OAuth client is keyed on the **pair** (package name, SHA-1 of the signing certificate). Change either half and the existing client no longer matches — sign-in fails with `DEVELOPER_ERROR` (status code 10), which the library's troubleshooting page describes as *"always (! absolutely always !) a configuration mismatch between your app and the server-side setup."*

The library's config guide says the same thing explicitly:

> "you need to get the SHA-1 certificate fingerprints for _all_ signing configurations and then use _all_ of those SHA-1 fingerprints" — creating an Android OAuth client **for each** fingerprint.
> — <https://react-native-google-signin.github.io/docs/setting-up/get-config-file>

### How EAS makes this worse (the trap)

Expo's own tutorial on multiple app variants:

> "Since we changed the Android Application ID and iOS Bundle Identifier, the EAS CLI will prompt us to generate a **new Keystore** for Android and a new provisioning profile for iOS."
> — <https://docs.expo.dev/tutorial/eas/multiple-app-variants/>

EAS-managed Android credentials are scoped **per application identifier**. `com.bhashasakhi.app` and `com.bhashasakhi.app.dev` therefore have **two different EAS keystores with two different SHA-1s** — the package name and the certificate both differ between variants. That is two independent Android OAuth clients before Play App Signing is even considered.

Then Play App Signing adds a third. Expo:

> "You sign with an upload certificate, and Google Play will automatically replace it with the **app signing certificate**."
> — <https://docs.expo.dev/app-signing/app-credentials/>

The APK a user installs from the Play Store is signed by **Google's app signing key**, not by your EAS upload key. At runtime Google Play services checks the *installed* app's signature. So the production build's Play-distributed SHA-1 is a different fingerprint from the same build's EAS-produced artifact.

### The count

| # | Client type | Package name | Certificate | Where the SHA-1 comes from | Needed for |
| --- | --- | --- | --- | --- | --- |
| 1 | **Web** | — | — | — | `webClientId` in `configure()`; registered in Supabase. **One, shared by everything.** |
| 2 | Android | `com.bhashasakhi.app.dev` | EAS keystore for the `.dev` package | `eas credentials` (Android → development) / Configuration Doctor | Signing in from the dev client |
| 3 | Android | `com.bhashasakhi.app` | EAS keystore (upload key) for the prod package | `eas credentials`, or Play Console → Release → Setup → App Integrity → **Upload key certificate** | Signing in from a locally installed `preview`/`production` artifact not delivered by Play |
| 4 | Android | `com.bhashasakhi.app` | **Google Play app signing key** | Play Console → Release → Setup → App Integrity → **App signing key certificate** | **Every real user.** Omit this and sign-in works everywhere except production. |

**Total: 4 OAuth clients — 1 Web + 3 Android.**

Client #4 is the one most likely to be forgotten, because everything works in testing without it. Client #3 can be skipped only if you never sign in on a non-Play-delivered production-package build — but the `preview` profile in `eas.json` produces exactly such a build (no `APP_VARIANT`, so the production package name), so in practice keep it.

Expo's guide names both Play Console locations directly:

> "Fingerprint of the .apk you built (on your machine or using EAS Build)" and "Fingerprint(s) of a production app downloaded from the play store" — both under **Release > Setup > App Integrity**.
> — <https://docs.expo.dev/guides/google-authentication/>

### If the app is ever migrated / re-signed

Play key rotation, an EAS keystore reset, or moving to a new upload key each invalidate a fingerprint. The fix is always the same: add a new Android OAuth client for the new (package, SHA-1) pair. Never delete the old client until the old-signature installs are gone from the field.

---

## 7. What changes in `app.config.ts` — less than expected

**Nothing about Google needs to be variant-switched.** This is the useful surprise.

- Android OAuth client IDs are **never referenced from JavaScript**. They exist only server-side at Google, matched by package name + signature. The library's `configure()` type (`ConfigureParams` in the published `.d.ts`) has no `androidClientId` field at all — only `webClientId`, `iosClientId`, `scopes`, `offlineAccess`, `hostedDomain`, `forceCodeForRefreshToken`, `accountName`, plus iOS-only options.
- The **Web client ID is a single value shared by both variants** ("The Web client ID is the one used in your Android app" — Supabase).

So the only reason to branch on `IS_DEV` would be pointing dev and prod at **different Supabase projects**, which is a platform-ticket decision, not a Google one. If that is wanted, the shape is:

```ts
// app.config.ts — only if dev/prod use separate Supabase projects
extra: {
  eas: { projectId: "5bb1371e-ade4-40b3-be28-5e1a8638854a" },
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
},
```

with the values supplied per build profile via `eas.json` `env` blocks (the `development` profile already carries an `env` block for `APP_VARIANT`). A Google **Web** client ID is not a secret (it is embedded in every shipped app), so it may equally be hardcoded; use env only for the dev/prod-project split.

---

## 8. Supabase wiring

Dashboard (Authentication → Providers → Google):

1. Enable the Google provider.
2. Add the **Web client ID** under **Client IDs** (this is the `aud` of the ID token, because it is what is passed as `webClientId`).
3. Enable **Skip Nonce Check** — Supabase's React Native instructions call for it, since the Original module does not surface a nonce to pass back to `signInWithIdToken`.

Client code (Supabase's own sample, adapted):

```ts
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/utils/supabase";

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID, // type WEB, not Android
  scopes: ["email", "profile"],      // default anyway; matches #23's "email + display name only"
});

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return null; // user cancelled
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.data.idToken,
  });
  if (error) throw error;
  return data;
}
```

Notes:

- `signInWithIdToken` takes `{ provider, token, access_token?, nonce? }` (<https://supabase.com/docs/reference/javascript/auth-signinwithidtoken>). Only `provider` and `token` are needed here.
- `idToken` is typed `string | null` on the user object; guard it. Error handling should branch on `statusCodes.SIGN_IN_CANCELLED`, `statusCodes.IN_PROGRESS`, `statusCodes.PLAY_SERVICES_NOT_AVAILABLE`, and `DEVELOPER_ERROR` (the credential-mismatch case).
- The response user object exposes `email`, `name`, `givenName`, `familyName`, `photo`, `id` — the map's "email + display name only" rule is a *storage* discipline, not something the library restricts. Persist only what #23 allows.
- `offlineAccess` / `serverAuthCode` are **not** needed: Supabase only wants the ID token. Leave `offlineAccess` off.
- Supabase JS in React Native needs `AsyncStorage` as its session store plus `detectSessionInUrl: false`; `@react-native-async-storage/async-storage` is already a dependency here.

---

## 9. Mechanical setup checklist

**Google Cloud Console** (project + OAuth consent / Google Auth Platform configured first)

1. Create OAuth client of type **Web**. Record the client ID → this is `webClientId`.
2. Create OAuth client type **Android**: package `com.bhashasakhi.app.dev`, SHA-1 = dev-variant EAS keystore.
3. Create OAuth client type **Android**: package `com.bhashasakhi.app`, SHA-1 = production EAS keystore / Play **upload key certificate**.
4. Create OAuth client type **Android**: package `com.bhashasakhi.app`, SHA-1 = Play **app signing key certificate**.

**Fingerprints**

- `eas credentials` → Android → select the build profile / package to inspect the EAS keystore.
- Play Console → Release → Setup → **App Integrity** for both upload and app signing certificates.
- Cross-check with the library's **Configuration Doctor**, which the docs recommend as the universal way to read fingerprints regardless of build source.

**Repo**

5. `npx expo install @react-native-google-signin/google-signin` (and `@supabase/supabase-js`).
6. Do **not** add the config plugin (§5).
7. Add the Web client ID (hardcode, or via `extra` + env if dev/prod use separate Supabase projects).
8. `eas build --profile development --platform android` → install the new dev client. The old one will not work.

**Supabase**

9. Enable Google provider, register the Web client ID, turn on **Skip Nonce Check**.

**Verify**

10. Dev client sign-in → confirms client #2.
11. Internal-track / Play-delivered build sign-in → confirms client #4. **This is the check that must not be skipped**; a `DEVELOPER_ERROR` only in production is the classic symptom of a missing Play-app-signing-key client.

---

## 10. Confidence and gaps

**High confidence (direct primary-source statements):**

- Supabase recommends `@react-native-google-signin/google-signin` + `signInWithIdToken` for React Native; needs both Web and Android OAuth clients; the Web client ID is the one used in the Android app.
- Expo deprecates `expo-auth-session`'s Google provider in favour of this library.
- Library supports `expo` 52.0.40–57 and `react-native` 0.76–0.86, old **and new** architecture; Expo SDK 53+ already satisfies its `compileSdk`/Kotlin floors. SDK 54 / RN 0.81.5 / new arch is therefore confirmed compatible.
- Not usable in Expo Go; requires a development build.
- Android OAuth clients are keyed on package name **and** SHA-1 (Google's own docs); one client per signing configuration (library docs).
- Distinct application identifiers get distinct EAS keystores (Expo tutorial).
- Play App Signing replaces the upload certificate with Google's app signing certificate (Expo docs).
- One Tap / Credential Manager in this library is a **paid** feature; the Original module is free and still shipped in 16.1.4 (verified in the published package's type definitions).
- The non-Firebase config plugin is iOS-only and throws without `iosUrlScheme` (verified by reading `plugin/build/withGoogleSignIn.js` in the published 16.1.4 tarball — stronger evidence than the docs, which are silent on this).
- Legacy Google Sign-In for Android is deprecated with **no published removal date**.

**Medium confidence:**

- The exact `eas credentials` menu path for reading the keystore SHA-1. Expo's docs confirm `eas credentials` shows configured signing credentials but do **not** document fingerprint output; the fingerprint is known to be printed in the keystore detail view, but treat the Play Console App Integrity page (which Expo *does* document) as the authoritative route.
- The claim that client #3 (prod package + upload/EAS key) is needed. It is needed only for production-package builds installed outside Play. Derived from the rule, not stated as such in any single source.
- That client #4's fingerprint must come from Play App Signing rather than the upload key. Follows necessarily from "Google Play will automatically replace [the upload certificate] with the app signing certificate", and Expo's guide does list the downloaded-from-Play fingerprint as a distinct required input — but no source states the failure mode in those words.

**Could not confirm / open questions:**

- **`reactCompiler: true` interaction.** No primary source discusses the React Compiler with this library either way. No mechanism for a conflict is apparent (native module + thin JS wrapper), but this is unverified rather than verified-safe. Cheap to falsify: build the dev client and sign in once.
- **OAuth consent screen / Google Auth Platform requirements** — whether the `email`/`profile` scopes keep the app in the "non-sensitive scopes, no verification needed" lane, and whether publishing status affects a Play-distributed app. Not researched; it is arguably a separate ticket, and it can block a release if wrong. **Recommend a follow-up check before the ADR is written.**
- **Whether Supabase's "Skip Nonce Check" carries a security cost worth documenting** in the ADR. Supabase notes nonce validation is on by default and can be disabled "if client libraries cannot handle verification properly" — no discussion of the trade-off was found.
- **Google's removal timeline for legacy GSI.** No date is published; the 2025-era blog posts referenced "phased removals" without binding dates for this specific SDK. Cannot state when the migration to Credential Manager becomes mandatory.
- **`react-native-nitro-google-signin` maturity.** MIT, free, Credential-Manager-based, and endorsed by Expo's guide — but first published 2026-06-01. No data on production adoption, and its Supabase interop (does its response expose an `idToken` in the same shape?) was **not** confirmed from its docs. If the Credential Manager deprecation becomes urgent, this needs its own evaluation.

---

## Sources

- <https://supabase.com/docs/guides/auth/social-login/auth-google> (React Native platform tab)
- <https://supabase.com/docs/reference/javascript/auth-signinwithidtoken>
- <https://docs.expo.dev/guides/google-authentication/>
- <https://docs.expo.dev/versions/latest/sdk/auth-session/>
- <https://docs.expo.dev/tutorial/eas/multiple-app-variants/>
- <https://docs.expo.dev/app-signing/app-credentials/>
- <https://docs.expo.dev/app-signing/managed-credentials/>
- <https://react-native-google-signin.github.io/docs/install>
- <https://react-native-google-signin.github.io/docs/setting-up/expo>
- <https://react-native-google-signin.github.io/docs/setting-up/get-config-file>
- <https://react-native-google-signin.github.io/docs/original>
- <https://react-native-google-signin.github.io/docs/one-tap>
- <https://react-native-google-signin.github.io/docs/troubleshooting>
- <https://developer.android.com/identity/sign-in/legacy-gsi-migration>
- <https://support.google.com/cloud/answer/6158849>
- npm: `@react-native-google-signin/google-signin@16.1.4` (published tarball: `plugin/build/withGoogleSignIn.js`, `lib/typescript/src/types.d.ts`), `react-native-nitro-google-signin@1.3.0`
