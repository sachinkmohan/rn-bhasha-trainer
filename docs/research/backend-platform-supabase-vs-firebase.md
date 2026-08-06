# Backend platform: Supabase vs Firebase

Research for [issue #24](https://github.com/sachinkmohan/rn-bhasha-trainer/issues/24), part of the map in #23.
Researched 2026-08-06. All claims cite primary sources (supabase.com, firebase.google.com, docs.expo.dev, rnfirebase.io).

## Question

Which platform serves: hosted auth with Google Sign-In, a Postgres-ish store for synced progress, and — decisively — a serverless function that can make outbound HTTP calls to a third-party AI API on a free or near-free tier, so the model API key never ships in the Expo bundle.

## Recommendation

**Supabase.** Confirm the direction of travel from #23; do not switch to Firebase.

The load-bearing claim held — and in fact held *more strongly* than the ticket assumed. The premise was "Firebase Cloud Functions require Blaze to make outbound requests to non-Google services." The current documented reality is broader: **Cloud Functions cannot be deployed at all on the Spark plan, to any destination.** Supabase Edge Functions, by contrast, are on the Free plan (500K invocations/month) and can call third-party APIs with only an SMTP-port restriction.

One honest caveat, below: if the AI provider were fixed to **Gemini**, Firebase has a documented no-Blaze path (Firebase AI Logic + Gemini Developer API on Spark) that removes the need for a proxy function entirely. That is the only scenario where Firebase wins, and it costs you model-provider freedom.

---

## 1. The load-bearing fact: Firebase Cloud Functions and the Blaze plan

**Answer: Yes — and worse than assumed. Deploying any Cloud Function requires Blaze, regardless of what it calls.**

The authoritative statement, verbatim from the official Cloud Functions for Firebase getting-started guide:

> "You can emulate functions in any Firebase project, but to deploy functions, your project must be on the Blaze pricing plan."

— https://firebase.google.com/docs/functions/get-started (appears twice on that page; the second instance reads "Keep in mind that to deploy in production, your project must be on the Blaze pricing plan.")

Corroborated by two more first-party pages:

- **Pricing page.** In the plan comparison table, every Cloud Functions metric under the Spark column reads **"Not applicable"** — Invocations, GB-seconds, CPU-seconds, Outbound networking, Cloud Build minutes, Container storage in Artifact Registry. The figures for those metrics ("No-cost up to 2M/month" invocations, "No-cost up to 5 GB/month" outbound networking then $0.12/GB) are the **Blaze** column, not Spark. — https://firebase.google.com/pricing
- **Pricing plans doc.** "Access to Cloud Functions" is listed only under Blaze plan benefits. The same page states: "Paid Google Cloud products and features (like Pub/Sub, Cloud Run, or BigQuery streaming for Analytics) are not available for projects on the Spark plan." — https://firebase.google.com/docs/projects/billing/firebase-pricing-plans

**Note on the old restriction.** The historically-cited rule — "the Spark plan allows outbound network requests only to Google-owned services" — no longer appears on the current pricing page or the Firebase FAQ (I grepped the raw HTML of both). It has been superseded: Cloud Functions moved to a Cloud Build / Artifact Registry deployment pipeline, both of which are billed Google Cloud products, so the whole product now sits behind Blaze. The conclusion the ticket needed is unchanged and strengthened.

**What Blaze actually costs.** Blaze requires attaching a Cloud Billing account (i.e. a credit card). Firebase offers "$300 in free credit when you upgrade to the Blaze plan" and Blaze retains generous no-cost daily quotas (https://firebase.google.com/pricing). And note the asymmetry in overage behaviour: on **Spark**, "If you exceed the no-cost quota limit in a calendar month for any product, your project's usage of that specific product will be shut off for the remainder of that month" — a hard cap. On **Blaze**, overage bills. There is no spend cap. For a solo-maintained hobby-scale app, an uncapped bill attached to an AI proxy endpoint is a real (if small) tail risk.

## 2. Supabase Edge Functions

**Outbound calls to third-party APIs: supported, one restriction.**

From the Edge Function limits doc, the only documented network restriction is:

> "Outgoing connections to ports `25` and `587` are not allowed."

— https://supabase.com/docs/guides/functions/limits (i.e. SMTP is blocked; ordinary HTTPS on 443 to any host is fine)

Supabase's own docs ship a worked example of exactly the pattern this project needs — an Edge Function calling the OpenAI API with the key held server-side:

```ts
const apiKey = Deno.env.get('OPENAI_API_KEY')
const chatCompletion = await openai.chat.completions.create({ ... })
```

with production secrets set via `supabase secrets set --env-file ./supabase/.env.local`.
— https://supabase.com/docs/guides/functions/examples/openai

**Runtime limits** (https://supabase.com/docs/guides/functions/limits):

| Limit | Free | Paid |
| --- | --- | --- |
| Wall-clock duration | 150s | 400s |
| CPU time per request | 2s | 2s |
| Memory | 256MB | 256MB |
| Request idle timeout | 150s (then 504) | — |

The 2s **CPU** limit is not a problem for a proxy: waiting on an upstream AI API is I/O, not CPU. The 150s wall clock comfortably covers a streamed model response.

**Free-tier invocations:** "500,000 included" per month (https://supabase.com/pricing). For an offline-first app that syncs infrequently, this is not a constraint worth modelling.

**Cold starts.** Supabase's architecture doc says: "Even initial executions are fast (milliseconds) due to the compact ESZip format and minimal Deno runtime overhead," and "Isolates can remain active for a period (plan-dependent) to handle subsequent requests without restarting." — https://supabase.com/docs/guides/functions/architecture. Supabase's engineering blog claims "up to 97% faster cold starts" after moving script evaluation to a dedicated blocking pool — https://supabase.com/blog/persistent-storage-for-faster-edge-functions. **These are first-party but unquantified for the Free plan specifically; treat "milliseconds" as a vendor claim, not a guarantee.** See gaps.

## 3. Free-tier limits, side by side

| | Supabase Free | Firebase Spark |
| --- | --- | --- |
| Auth MAU | 50,000 | 50,000 (SAML/OIDC: 50) |
| Database | 500 MB (shared CPU, 500 MB RAM) | Firestore 1 GiB stored |
| Egress | 5 GB + 5 GB cached | Firestore 10 GiB/mo; Hosting 360 MB/day |
| Serverless functions | 500,000 invocations/mo | **Not available** |
| File storage | 1 GB | Cloud Storage (limits apply) |
| Projects | "Limit of 2 active projects" | — |

Sources: https://supabase.com/pricing, https://firebase.google.com/pricing

**On overage:**

- **Supabase Free:** "If you continue to exceed the limits, service restrictions will apply." Documented Fair Use restrictions include "Pausing projects", "Switching databases to read-only mode", "Disabling new project launches/transfers", and "Responding with a 402 status code for all API requests." No automatic charges. — https://supabase.com/docs/guides/platform/billing-faq
- **Firebase Spark:** product usage "will be shut off for the remainder of that month." For Realtime Database specifically the FAQ is blunter: "when you exceed any plan limit in any month, your app will be turned off." — https://firebase.google.com/docs/projects/billing/firebase-pricing-plans, https://firebase.google.com/support/faq
- **Firebase Blaze:** overage bills at Google Cloud rates. No spend cap.

Auth MAU is a tie at 50K, and Bhasha Sakhi is nowhere near it either way. **Database size and egress are not the deciding factors** — progress rows keyed by word UUID are tiny. The decision is made entirely by the function tier.

Pro tier for reference, if the free tier is ever outgrown: Supabase Pro is "from $25/month" with 100,000 MAU, 8 GB disk, 250 GB egress, 2M Edge Function invocations (https://supabase.com/pricing).

## 4. React Native / Expo support

This repo is on `expo ~54.0.34`, `react-native 0.81.5`, with `expo-dev-client` already added (commit 3d9dfaa).

**Both platforms need a development build**, so that is *not* a differentiator. Native Google Sign-In on Android requires `@react-native-google-signin/google-signin`, and: "This package cannot be used in Expo Go because it uses native code" — https://react-native-google-signin.github.io/docs/setting-up/expo. The repo already has `expo-dev-client`, so this cost is already paid.

**Supabase:**

- Official Expo tutorial: `npx expo install @supabase/supabase-js @react-native-async-storage/async-storage`. AsyncStorage is the default session store; the tutorial also documents an encrypted-session variant using `aes-js` + `expo-secure-store`. — https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
- Google Sign-In: obtain an ID token with `@react-native-google-signin/google-signin`, pass it to `signInWithIdToken`. Android's native flow uses the Credential Manager library. — https://supabase.com/docs/guides/auth/social-login/auth-google
- `@supabase/supabase-js` is a pure-JS client with no native module of its own, so it carries no New Architecture migration surface. The only native dependency in the auth path is the Google Sign-In library — which Firebase also needs.

**Firebase:** two mutually exclusive routes, both with friction.

- *Firebase JS SDK*: works in Expo Go, no config plugin. But Expo's own guide flags the known pain point: "If you encounter issues related to authentication persistence with Firebase JS SDK, see the guide for setting up persistence to keep users logged in between reloads." — https://docs.expo.dev/guides/using-firebase/. It also "does not support all services for mobile apps."
- *React Native Firebase*: "React Native Firebase cannot be used in the pre-compiled Expo Go app because React Native Firebase uses native code that is not compiled into Expo Go" — https://rnfirebase.io/. Requires config plugins plus `google-services.json`. It is also mid-migration: "React Native Firebase is moving to the modular API away from the namespaced chaining API in the next major release" — an API churn you'd be adopting into.

**New Architecture context:** SDK 54 "is the final release to include Legacy Architecture support"; "In React Native 0.82, it will no longer be possible to opt out of the New Architecture", and SDK 55 "only support the New Architecture" — https://expo.dev/changelog/sdk-54. Fewer native modules in the auth path is therefore a durable advantage, and Supabase has fewer.

## 5. Fit for an offline-first app that syncs infrequently

Neither platform's data model is a problem — the app writes a mirror of one AsyncStorage blob, monotonically merged. But there is **one Supabase-specific operational hazard worth naming**:

> "A Free plan project is considered inactive if it does not receive sufficient user database activity over the past week."

Free projects are paused after roughly a week of inactivity. Supabase sends a warning email about a week before and a confirmation email after. **Restore is manual** — "Open the Supabase Dashboard… Select the paused project… Click Resume project and confirm." There is no documented automatic resume on incoming request. Paid projects are never paused for inactivity. — https://supabase.com/docs/guides/platform/free-project-pausing, https://supabase.com/pricing

Practical read: for the **production** project with real Play Store users syncing, a full week of zero database activity is implausible, so auto-pause is unlikely to bite. It *will* bite a **dev/staging** project that sits idle between work sessions, and it would bite production during a long pre-launch gap. Two mitigations, in order of honesty: accept manual resume for the dev project, or move production to Pro ($25/mo) when sync goes live and pausing becomes unacceptable. Note also the Free plan's "Limit of 2 active projects" — exactly enough for one dev and one prod, with no slack.

Firebase has no equivalent pausing behaviour, which is a genuine point in its favour. It does not outweigh the function tier.

## 6. The one case for Firebase

If the AI provider is **Gemini**, Firebase offers a documented path that needs neither Blaze nor a proxy function. Firebase AI Logic with the Gemini Developer API runs on the "no-cost Spark pricing plan", and the docs state explicitly:

> "To use this 'free tier', you do **not** link your project to a Cloud Billing account."

Paid tiers require "upgrading to the pay-as-you-go Blaze pricing plan and linking a Cloud Billing account." — https://firebase.google.com/docs/ai-logic/pricing

This is a real counter-argument and should not be waved away: it removes the server-side proxy from the architecture entirely, replacing key secrecy with Firebase App Check attestation. The reasons it still loses here:

1. It hard-couples the model provider to Gemini. Issue #24 specifies "a third-party AI API", which implies provider choice.
2. Key secrecy becomes attestation-based rather than the key simply never leaving the server. Different threat model, weaker guarantee.
3. It solves only the AI call. Auth and the synced progress store still need Firebase Auth + Firestore, and any *other* server-side logic you later want (a scheduled cleanup, a webhook, a non-Gemini API) drops you straight back into the Blaze requirement.
4. Free-tier Gemini Developer API usage typically carries data-use terms distinct from paid usage. **I did not verify the current terms** — see gaps.

## Confidence and gaps

**High confidence (verified verbatim on first-party pages):**

- Deploying Cloud Functions requires the Blaze plan. Three independent Firebase pages agree; the pricing table shows "Not applicable" for every Spark-column Cloud Functions metric.
- Supabase Edge Functions permit outbound HTTPS to third parties; only ports 25 and 587 are blocked.
- Free-tier numbers in §3, quoted directly from the two pricing pages.
- Supabase Free project auto-pause after ~1 week of database inactivity, with manual restore.
- Both platforms require a development build for native Google Sign-In; React Native Firebase cannot run in Expo Go.
- Firebase AI Logic + Gemini Developer API runs on Spark with no billing account.

**Gaps and things I could not confirm:**

- **Cold-start numbers for Supabase Edge Functions on the Free plan.** The docs say isolate warm-time is "plan-dependent" but never publish the per-plan figure, and the "milliseconds" cold-start claim is unquantified vendor language. If first-call latency on an AI proxy matters to UX, **measure it** rather than trusting this. A prototype ticket would settle it.
- **The old "Spark allows outbound only to Google-owned services" rule.** I could not find it on any current Firebase page and believe it has been superseded, but I could not find an explicit deprecation notice either. I am inferring supersession from its absence plus the stronger Blaze-for-all-functions rule. The *practical* conclusion is unaffected.
- **New Architecture compatibility statements.** Neither `@react-native-google-signin/google-signin`'s Expo page nor rnfirebase.io's install page makes an explicit New Architecture claim in the text I retrieved. My §4 argument rests on "fewer native modules = less migration surface", which is sound reasoning but not a sourced compatibility guarantee for either library.
- **Gemini Developer API free-tier data-use terms.** Not checked. If the Firebase AI Logic path is ever seriously reconsidered, verify whether free-tier prompts may be used for model training — that would be disqualifying for user-submitted content.
- **Firebase Blaze spend caps.** I found no documented hard spend cap; Google Cloud budget *alerts* exist but alerting is not capping. I did not verify whether any true cap mechanism now exists.
- **Supabase Edge Function max request/response payload size** is not stated on the limits page.

## Sources

- https://firebase.google.com/docs/functions/get-started
- https://firebase.google.com/pricing
- https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- https://firebase.google.com/support/faq
- https://firebase.google.com/docs/ai-logic/pricing
- https://supabase.com/pricing
- https://supabase.com/docs/guides/functions/limits
- https://supabase.com/docs/guides/functions/architecture
- https://supabase.com/docs/guides/functions/examples/openai
- https://supabase.com/docs/guides/platform/free-project-pausing
- https://supabase.com/docs/guides/platform/billing-faq
- https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/blog/persistent-storage-for-faster-edge-functions
- https://docs.expo.dev/guides/using-firebase/
- https://expo.dev/changelog/sdk-54
- https://react-native-google-signin.github.io/docs/setting-up/expo
- https://rnfirebase.io/
