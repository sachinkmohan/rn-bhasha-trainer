# Google Play compliance for adding an optional account to a live app

Research for [issue #25](https://github.com/sachinkmohan/rn-bhasha-trainer/issues/25) (part of map #23). Answers the question: what does Google Play actually require when `com.bhashasakhi.app` — already live, no accounts today — starts offering an **optional** Google Sign-In that collects **email address + display name**, with **no login wall** and all existing functionality still available anonymously.

Researched 2026-08-06. Every compliance claim below is sourced to Google's own Play Console Help / Developer Program Policy pages. Third-party sources were not used.

## Primary sources used

| Ref | Page | URL |
| --- | --- | --- |
| **[UD]** | Developer Program Policy — User Data (incl. Personal and Sensitive User Data, Data safety section, Privacy Policy, Account Deletion Requirement) | https://support.google.com/googleplay/android-developer/answer/13316080 |
| **[DS]** | Provide information for Google Play's Data safety section | https://support.google.com/googleplay/android-developer/answer/10787469 |
| **[AD]** | Understanding Google Play's app account deletion requirements | https://support.google.com/googleplay/android-developer/answer/13327111 |
| **[PR]** | Prepare your app for review (App content page; "Sign-in details") | https://support.google.com/googleplay/android-developer/answer/9859455 |
| **[SI]** | Requirements for providing sign in details for review | https://support.google.com/googleplay/android-developer/answer/15748846 |
| **[PC]** | Developer Program Policy — Play Console Requirements | https://support.google.com/googleplay/android-developer/answer/10788890 |

---

## 1. App Access declaration

**Short answer: yes — with no gated functionality this declaration can honestly stay "no special access required", and nothing needs to be supplied. It flips the moment any feature is reachable only when signed in.**

The obligation is conditional, and the condition is *restriction*, not *the existence of an account*. Play Console Help states, under the heading now labelled **"Sign-in details"** on the App content page [PR]:

> "If your entire app or parts of your app are restricted based on login credentials, sign in details, memberships, location, or other forms of authentication, you must **provide all required details to enable access to your app**."

The policy-level phrasing is the same conditional [PC], under "Before you submit your app, you must":

> "3.3. Provide an active demo account, login information, and all other resources needed for Google Play to review your app (specifically, sign in details, QR code, etc.)"

read together with [SI]:

> "To ensure your app can be properly reviewed for compliance with Developer Program policies, you must provide the necessary information for our team to log in and **access all app functionality**, per Play Console Requirements."

**Applied to the optional-account release.** A reviewer who never signs in can reach 100% of the app's functionality. Nothing is "restricted based on login credentials". So the honest answer is that no access instructions are needed. Adding an optional sign-in button does not by itself create a restriction — the trigger in every quoted sentence is *restricted*/*access all app functionality*, not *offers accounts*.

**When it flips.** The declaration must change as soon as **any** feature is available only to signed-in users — the ticket's own example, AI-assisted practice, is exactly this. [PR] says "your entire app **or parts of your app**", so partial gating is enough. [SI] adds the paywall analogue, which is the same shape of problem:

> "If your app does not require sign-in details but you have functionalities or content behind a subscription paywall, please provide additional instructions or access details that will allow us to fully and freely access and review the app behind the paywall."

**What must be supplied at that point** [SI], verbatim:

> - "Your sign-in details must be accessible at all times, reusable, and valid regardless of user location."
> - "Your sign-in details must be maintained at all times without any error. For example, if your app typically requires a 2-Step verification code or One-time password, make sure to provide reusable login credentials that can bypass these requirements. If the provided password expires, we may not be able to review your app and, therefore, the app may be rejected."
> - "Your sign-in details must be provided in English."
> - "If your sign-in details are not numeric or alphanumeric (for example, a QR code or barcode), generate a static URL and upload it to Play Console."
> - "If your app requires sign-in details involving other accounts (such as 'sign-in with Google, Facebook', or similar), **provide all account information with detailed instructions**. Clear and simple instructions will help ensure a smooth review process."
> - "If your app normally uses a location-dependent password (for example, geo-gate), provide sign-in details that are valid regardless of user location (for example, 'master' login credentials)."

Mechanically: Play Console → **Policy and programs > App content** → "Sign-in details" → **Start** / **Manage** → **+ Add new instructions**, with an "Any other instructions" free-text field for anything unusual about the login mechanism [PR].

**This corroborates the map's out-of-scope note on email+password.** The last bullet above is the primary-source basis for it: Google-only sign-in means the reviewer credential *is* a Google account, which must be "accessible at all times, reusable, and valid regardless of user location" and "maintained at all times without any error". A Google account handed to an external reviewer is subject to Google's own anti-abuse blocking and unusual-location challenges, and [SI] gives no exemption for that. Conservative reading: **before the first release that gates anything behind login, ship a non-Google credential path (or an equivalent reviewer bypass) that satisfies the "accessible at all times / reusable / regardless of location" bar.**

⚠️ **Ambiguity flagged.** The exact radio-button strings in the Play Console UI (historically "All functionality is available without special access" vs "All or some functionality is restricted") are **not quoted in any Help Center article** — they appear only in the signed-in Console. Do not treat the phrasing above as a quotation. The *obligation* is fully sourced; the label is not. Read the on-screen wording at submission time and match it to the quoted condition.

---

## 2. Data Safety form

**Short answer: declare Name and Email address as Collected (not Shared), Optional, purpose Account management (+ App functionality if used for sync); answer Yes to both encryption-in-transit and the deletion-request question.**

### Data types

Both are in the "Personal info" category [DS]:

> - **Name** — "How a user refers to themselves, such as their first or last name, or nickname."
> - **Email address** — "A user's email address."
> - **User IDs** — "Identifiers that relate to an identifiable person. For example, an account ID, account number, or account name."

⚠️ If the Supabase row is keyed by a stable per-user id (a Supabase `auth.users.uid`, or the Google `sub`) that is stored server-side, **User IDs must also be declared.** [DS]: "the collection of an account name associated with an identifiable person should be declared as a 'Personal identifier'". Practically, an authenticated Supabase deployment always persists such an id, so plan on three data types, not two. Also declare **App activity → Other actions** or **App interactions** if the synced practice progress itself is transmitted off-device — which is the entire point of the feature. Progress-per-word is user activity data, and [DS] defines "Other actions" as "Any other user activity or actions in-app not listed here". Conservative reading: **declare the synced progress too.**

### Collected vs shared

[DS]:

> "'Collect' means transmitting data from your app off a user's device."

Sending email/name to Supabase is collection. It is **not** sharing, because [DS] excludes service providers:

> "The following types of data transfers do not need to be disclosed as 'sharing': **Service providers.** Transferring user data to a 'service provider' that processes it on behalf of the developer. 'Service provider' means an entity that processes user data on behalf of the developer and based on the developer's instructions."

and:

> "A service provider may only process user data on your behalf. For example, an analytics provider that processes user data from your app solely on your behalf, or **a cloud provider hosting user data from your app for your use, will typically qualify as 'service providers'**."

Supabase-as-backing-store fits that description squarely. **Collected: Yes. Shared: No.**

### Required vs optional

This is where "no login wall" pays off, and Google's guidance names the exact scenario [DS]:

> "You can declare that your app collects certain data optionally only if all users – regardless of device or region – can either optionally provide information, opt-out, or opt-in to have the data collected."
>
> "Examples of optional data collection include: … **User data that is only collected when a user signs in where users have the ability to engage with the app without being signed-in.**"

That second example is Bhasha Sakhi verbatim. **Declare Optional** ("Users can choose whether this data is collected" [DS] CSV label `PSL_DATA_USAGE_USER_CONTROL_OPTIONAL`).

The counterpart warning, which is the thing that would flip it [DS]:

> "If any version of your app requires the collection of certain data, you must declare its collection as required for the Data safety section. You should not describe collection as optional if it is required for any of your app's users."

So the day a login wall appears anywhere — any version, any region — this answer changes.

### Purposes

[DS] purpose definitions:

> - **Account management** — "Used for the setup or management of a user's account with the developer. For example, to enable users to create accounts or add information to an account the developer provides for use across its services, log in to your app, or verify their credentials."
> - **App functionality** — "Used for features that are available in the app. For example to enable app features, or authenticate users."

And the on-point FAQ [DS]:

> "**My app lets the user create an account or add information to their account, for example, birthday or gender. How should I declare the data that the user adds to their account?** You should declare the collection of this data for account management, denoting (if applicable) where collection is optional for the user. In addition, as with any data types collected by your app, you should disclose this data for the purpose(s) for which your app uses it."

→ Email + Name + User ID: **Account management**. The synced progress data: **App functionality** (it powers cross-device sync, an in-app feature).

### Encryption in transit

The form asks it as a Yes/No in the "Data collection and security" section [DS]:

> "Whether or not all of the user data collected by your app is encrypted in transit."

Two things make this a *must-assert-and-must-be-true*, not an optional badge. The policy requires it independently [UD]:

> "Handle all personal and sensitive user data securely, including transmitting it using modern cryptography (for example, over HTTPS)."

and [DS] on how:

> "You should follow best industry standards to safely encrypt your app's data in transit. Common encryption protocols include TLS (Transport Layer Security) and HTTPS."

Supabase is HTTPS/TLS-only, so **answer Yes** — and there is no compliant configuration in which the honest answer is No.

### "Users can request that their data is deleted"

Form question [DS]:

> "Whether or not you provide a way for users to request that their data is deleted."

Eligibility [DS]:

> "You may select the deletion request mechanism badge in Data safety form if you: provide users with a mechanism to request data deletion; **or** automatically initiate deletion or anonymization of collected data within 90 days of collection. You may select the deletion request mechanism badge even if you need to retain certain data for legitimate reasons such as legal compliance or abuse prevention."
>
> "There is no prescribed mechanism, however as best practice the request mechanism should be easily discoverable and accessible by users. Common examples … include but are not limited to: in-app features, contact forms, or a dedicated email alias."

**Yes applies, and separately the account-deletion questions in the form are mandatory** — see §3. Note [DS]'s framing: "As part of completing the Data safety form, you are required to indicate if you provide such a mechanism."

### Scope caveat that affects the staged rollout

[DS]:

> "Google Play has one global Data safety form and Data safety section in the Google Play store listing per package name that is agnostic to usage, app version, region, and user age. In other words, **if any of the collection, uses, or linkages are present in any version of the app presently distributed on Google Play, anywhere in the world, you must indicate such on the form.** Therefore, your Data safety section describes the sum of your app's data collection and sharing across all its versions currently distributed on Google Play."

This is the decisive sentence for §4.

---

## 3. Account deletion

**Short answer: both obligations are real and non-negotiable. In-app deletion path + an externally reachable web URL. A contact form or support email is explicitly sufficient — self-service is not required. Google gives no fixed day-count; the standard is "a reasonably quick period of time".**

### The obligation, and the fact that "optional" does not soften it

[UD], "Account Deletion Requirement" — full policy text:

> "If your app allows users to create an account from within your app, then it must also allow users to request for their account to be deleted. **Users must have a readily discoverable option to initiate app account deletion from within your app and outside of your app** (for example, by visiting your website). A link to this web resource must be entered in the designated URL form field within Play Console."
>
> "When you delete an app account based on a user's request, you must also delete the user data associated with that app account. **Temporary account deactivation, disabling, or 'freezing' the app account does not qualify as account deletion.** If you need to retain certain data for legitimate reasons such as security, fraud prevention, or regulatory compliance, you must clearly inform users about your data retention practices (for example, within your privacy policy)."

**And, directly answering the "no gated functionality" question** [AD]:

> "**What if my app can be used without creating an app account?** If your app offers account creation in any part of the app experience, then you still need to offer app account deletion **even if some features can be accessed without an account**."

So optionality changes nothing here. The trigger is "offers account creation", full stop.

Also relevant, because Google Sign-In means the account is created via SSO [AD]:

> "An app account is a unique user identity that developers provide as a user-facing feature to serve the user across applications and/or devices … App accounts provide a mechanism for a user to authenticate and generally include a mechanism to verify an identity, such as password, phone number OTP (one-time password), 2FA (two-factor authentication), biometric, **SSO (single sign-on)**, and so on."
>
> "Your app supports account creation within the app if a user can complete creating an app account directly in the app **or if the app directs the user to an app account creation flow outside of the app**."

A Supabase user row created on first Google sign-in is an app account. (Note: exemptions are narrow — "Permanently private and enterprise device management apps are exempt" and "accounts that are created and operated offline are not app accounts". Neither applies.)

### In-app path

[AD]:

> "The requirements for your in-app path to deletion should be intuitive for the user. Meaning, the pathway should be prominent (for example, within the account settings or a similar section). We recognize that there are many ways developers can implement this within their apps."

An acceptable relaxation [AD]:

> "A full end-to-end mobile first account deletion can be a great user experience. However, we understand that this may not yet be feasible for some developers … As an alternative, you can choose to provide a link within your app that takes users to your app account deletion web resource."

### The web URL — what the page must actually do

Why it is required even with a perfect in-app flow [AD]:

> "Some users may have already uninstalled your app or not be able to access your in-app experience for a variety of other reasons. We want to ensure that all users can still exercise control over their data by being able to go to the web link based deletion resource that developers provide. **This means that your web resource should give users a way to request that their data be deleted without sending the user back to the app and requiring them to re-download it to submit their request.**"

The requirements, verbatim [AD]:

> "The weblink must be **functional** (for example, loads without error), **relevant in scope** (for example, the pathway to request account deletion should be prominently featured and easily discoverable on the page) and **reference the app or developer name** (that is, as it appears on your store listing in Google Play). The user must be able to request deletion of their account through the pathway. **You can offer this in many ways, like an additional link that initiates account deletion, a customer service email or a form they can submit a request through.** If the user needs to take additional steps before deleting their account (for example, canceling a subscription), this must be clearly outlined, and a support flow must be available for users to initiate. If you plan to use existing privacy or data retention policies to fulfill this requirement, the data deletion section should be highlighted and reasonably prominent (for example, through an anchor link)."

**→ A form is sufficient. So is a customer-service email address. Self-service is explicitly not required.** The cheapest compliant option for this app is a section on the existing privacy-policy site, anchor-linked, naming "Bhasha Sakhi", with a mailto or a simple form. Requirements to actually hit: loads without error, non-geofenced, prominent, names the app/developer.

### What must be erased

[AD]:

> "When you delete an app account based on a user's request, you must also delete the user data associated with that app account. It is possible that your app may need to retain certain data for legitimate reasons such as security, fraud prevention or regulatory compliance. Examples of user data include: personal and sensitive user data, personally identifiable information, financial and payment information, authentication information … **All user data indicated as collected in your data safety section is within scope.**"

And on processors [AD]:

> "If your app relies on service providers to process user data, you should delete the data from your own servers and request the service provider to do the same."

**This validates the map's standing decision.** Server-side data (Supabase row: email, name, user id, synced progress) must be erased unconditionally. Local AsyncStorage progress is **not** in scope — it is on-device data that was never "collected" ([DS]: "User data accessed by your app that is only processed locally on the user's device and not sent off device does not need to be disclosed"), so keeping it unless the user opts into wiping is compliant. The deletion UI should say plainly which of the two is happening.

### Timeline

There is **no number in Google's policy.** [AD]:

> "**How quickly should I fulfill users' deletion requests?** You should let users know what to expect and complete their requests within a reasonably quick period of time. Make sure to check with your legal advisors as laws and regulations in some countries impose specific requirements and restrictions concerning data deletion and retention."

The only day-count anywhere in these documents is the alternative route to the Data safety deletion badge — "automatically initiate deletion or anonymization of collected data within 90 days of collection" [DS] — which is a *different* question and should not be read as a deletion SLA. **Do not invent a Play-mandated timeline.** Conservative reading: for a Supabase-backed app, deletion is a synchronous DB operation, so make it immediate and state so in the privacy policy; that trivially satisfies "reasonably quick" and any GDPR Art. 17 argument.

### Where the URL goes

[UD]: "A link to this web resource must be entered in the designated URL form field within Play Console." The field lives in the **Data deletion questions inside the Data safety form**, on **App content** [AD]:

> "All developers must complete new Data deletion questions in the Data safety form on the App content page in Play Console."
>
> "If your app is within the scope of the policy requirements, you must disclose if your app provides account deletion and provide the web link within your Data safety form in Play Console."

Enforcement bite [AD]: "If there are issues with your answers to the Data deletion questions in your Data safety form, **new submissions and app updates will be rejected in Play Console**." The rollout deadlines in that article (Dec 2023 / May 2024) are long past — these are live requirements today, not upcoming ones.

---

## 4. Sequencing

**Short answer: same-submission is the mechanism Google provides — declarations are reviewed as part of the app review — but because the Data safety form is global across all live versions, a staged rollout gives you no grace period. Updating declarations first is the conservative order, and it is what the map already decided.**

### The declarations are reviewed with the release

[DS]:

> "After you complete and submit the Data safety form, **Google Play reviews the information you provide as part of the app review process.**"

[PC], the policy obligation, which is framed as a precondition of submission:

> "Before you submit your app, you must: … 3.2. Upload your app's privacy policy and fill out your Data safety section requirements. 3.3. Provide an active demo account, login information, and all other resources needed for Google Play to review your app."

So there is no separate "approve the declaration, then ship" gate: you submit the updated form and the new build, and both are reviewed. Practically this means **update the App content declarations before or with the submission** — [PC]'s "before you submit" is the operative wording.

### Why staged rollout gives no cover

This is the trap. [DS], quoted in full in §2:

> "if any of the collection, uses, or linkages are present in **any version of the app presently distributed** on Google Play, anywhere in the world, you must indicate such on the form."

A 10% staged rollout **is** distribution. The instant the auth build reaches the first 10% of users, the app "presently distributed on Google Play" collects email addresses, and the Data safety section must already say so. There is no version-scoped or percentage-scoped exception; Google explicitly offers the "About this app" section as the only place for version-specific nuance:

> "You can use the 'About this app' section to share version-specific information with your users."

**→ Order of operations: updated Data safety form (incl. data deletion questions + URL) and updated privacy policy submitted and live, the deletion web page live and functional, THEN begin the 10% rollout.** The map's standing decision ("Store declarations are updated before the release, then a staged rollout") is correct and is the reading this research supports.

### Timing realities

[DS]:

> "After you submit a new app or an update to an existing app on your Play Console, it can take some time for your app to be processed for standard publishing on Google Play. **Certain apps may be subject to expanded reviews, which may result in review times of up to 7 days or longer in exceptional cases.**"
>
> "it may take several days (in some cases up to 7 days) for app updates to reach all devices."

**Managed publishing** is the lever if you want to decouple approval from going live [DS]:

> "If managed publishing is turned on, your release won't be made available until you publish it. You can roll out the release from the Publishing overview page. The approved submission will then be published and available on Google Play shortly afterwards."

Recommended: turn managed publishing **on** for this release, so the store-listing Data safety change and the binary go live together at a moment you choose, rather than the listing updating while the build is still in review.

### Ongoing duty

[DS]: "You should update your Data safety section when there are relevant changes to the data practices of the app. **Your Data safety form responses must remain accurate and complete at all times.**"

[UD], Data safety section policy: "All developers must complete a clear and accurate Data safety section for every app detailing collection, use, and sharing of user data. The developer is responsible for the accuracy of the label and keeping this information up-to-date. **Where relevant, the section must be consistent with the disclosures made in the app's privacy policy.**"

⚠️ **Ambiguity flagged.** Google does not publish a sentence saying "you must not roll out the collecting build before the declaration is approved." The requirement is stated as accuracy-at-all-times plus "before you submit". The conservative reading — declarations updated and approved first, then roll out — is not contradicted by anything primary and is the only order with no window in which the label is wrong.

---

## 5. Privacy policy

**Short answer: it must be an active, public, non-geofenced, non-editable, non-PDF URL; it must name the app or the developer entity; it must cover authentication data, retention, and deletion; and it must be linked BOTH in Play Console and from inside the app. The Console field is App content → Privacy policy.**

Full policy text [UD], "Privacy Policy":

> "All apps must post a **privacy policy link in the designated field within Play Console, and a privacy policy link or text within the app itself.** The privacy policy must, together with any in-app disclosures, comprehensively disclose how your app accesses, collects, uses, and shares user data, **not limited by the data disclosed in the Data safety section**. This must include:
> - Developer information and a privacy point of contact or a mechanism to submit inquiries.
> - Disclosing the types of personal and sensitive user data your app accesses, collects, uses, and shares; and any parties with which any personal or sensitive user data is shared.
> - Secure data handling procedures for personal and sensitive user data.
> - **The developer's data retention and deletion policy.**
> - Clear labeling as a privacy policy (for example, listed as 'privacy policy' in title)."
>
> "The entity (for example, developer, company) named in the app's Google Play store listing must appear in the privacy policy or the app must be named in the privacy policy. Apps that do not access any personal and sensitive user data must still submit a privacy policy."
>
> "Please make sure your privacy policy is available on an **active, publicly accessible and non-geofenced URL (no PDFs) and is non-editable.**"

### What it specifically has to say about credentials and account data

"Personal and sensitive user data" is defined to include **authentication information** [UD]:

> "Personal and sensitive user data includes, but isn't limited to, personally identifiable information, financial and payment information, **authentication information**, phonebook, contacts, device location, SMS and call-related data, health data, Health Connect data, inventory of other apps on the device, microphone, camera, and other sensitive device or usage data."

Which pulls in the handling obligations [UD]:

> "Limit the access, collection, use and sharing of personal and sensitive user data acquired through the app to app and service functionality and policy-conforming purposes reasonably expected by the user"
>
> "Handle all personal and sensitive user data securely, including transmitting it using modern cryptography (for example, over HTTPS)."
>
> "Not sell personal and sensitive user data."

Concretely, the hosted policy for Bhasha Sakhi must state, at minimum:

1. **Who** — "Bhasha Sakhi" and/or the developer entity exactly as it appears on the store listing [UD].
2. **A privacy point of contact** or an inquiry mechanism [UD].
3. **What is collected when a user signs in** — email address, display name, an account identifier, and synced practice progress — and that it is collected **only if the user chooses to sign in**; the app is fully usable without an account.
4. **Google Sign-In as the authentication mechanism** and the fact that authentication tokens/credentials are handled by Google; no password is ever collected by the app.
5. **Who it is shared with** — the hosting/backend provider (Supabase) as a processor acting on the developer's instructions; note that even though this is *not* "sharing" for Data safety purposes [DS], the privacy policy obligation is broader ("not limited by the data disclosed in the Data safety section") and must name "any parties with which any personal or sensitive user data is shared" [UD].
6. **Secure handling** — TLS/HTTPS in transit [UD].
7. **Retention and deletion policy** — explicitly required [UD]. State how account deletion works, that server data is erased (not frozen), that on-device progress is retained unless the user asks otherwise, and any data retained for security/fraud/legal reasons, which [UD] and [AD] both require to be disclosed: "you must clearly inform users about your data retention practices (for example, within your privacy policy)."
8. **A prominent, anchor-linkable account-deletion section**, if that page is also serving as the §3 web resource [AD].
9. **Titled "Privacy Policy"** [UD].

Consistency is enforced [UD]: "Where relevant, the section must be consistent with the disclosures made in the app's privacy policy." A mismatch between the Data safety answers and the policy text is itself the violation.

### Where the URL is configured

[PR]:

> "Open Play Console and go to the **App content** page (**Policy and programs > App content**). Under 'Privacy Policy,' select **Start**. … Enter the URL hosting the privacy policy online. Save your changes."

Plus the second, easily-forgotten half [UD]: **a link or the text must also be reachable from inside the app.** Today Bhasha Sakhi has no accounts and arguably no sensitive-data trigger; once Google Sign-In ships, the in-app link becomes mandatory. Put it in the settings screen and adjacent to the sign-in button.

### Prominent Disclosure & Consent — probably not triggered, but read the trigger

[UD]'s Prominent Disclosure requirement applies:

> "In cases where your app's access, collection, use, or sharing of personal and sensitive user data **may not be within the reasonable expectation of the user** of the product or feature in question (for example, if data collection occurs in the background when the user is not engaging with your app)…"

A user who taps "Sign in with Google" reasonably expects their email and name to be collected, and the Google account chooser is itself an affirmative action — so the formal Prominent Disclosure interstitial is not triggered. ⚠️ This is a judgement call, not a quotable exemption. Conservative reading, and cheap to do: put one line of plain text next to the sign-in button — following Google's own recommended format, "[This app] collects/transmits/syncs/stores [type of data] to enable ['feature'], [in what scenario]" [UD] — e.g. *"Bhasha Sakhi syncs your email address, name and practice progress to your account so your progress follows you across devices."* That costs nothing and removes the argument entirely.

---

## Confidence and gaps

### High confidence — directly quoted from primary policy

- Account deletion applies even though the account is optional. [AD] answers the exact question ("even if some features can be accessed without an account"). **This is the single most important finding: optionality buys nothing here.**
- SSO-created accounts are app accounts. [AD]
- Web deletion resource may be a form or a customer-service email; self-service is not required. [AD]
- "Optional" is the correct Data safety answer, with Google's own example being verbatim this situation. [DS]
- Supabase is a "service provider", so Collected-not-Shared. [DS]
- Encryption in transit must be asserted and must be true. [DS] + [UD]
- The App Access / Sign-in details obligation is conditional on *restriction*, not on the existence of accounts. [PR] + [SI] + [PC]
- The Data safety form is global across all currently-distributed versions — staged rollout gets no grace period. [DS]
- Privacy policy content requirements, hosting requirements, and the in-app link requirement. [UD]

### Medium confidence — sourced, but requires a judgement call

- **Whether to declare "User IDs" and the synced progress data.** Depends on the final schema, which isn't settled (map lists it under "Not yet specified"). Conservative reading: declare both. Over-declaring is not a violation; under-declaring is.
- **Prominent Disclosure not being triggered.** Reasoned from [UD]'s "reasonable expectation" standard rather than an explicit carve-out. Mitigated cheaply by adding the one-line disclosure anyway.
- **Sequencing.** "Before you submit" [PC] and "accurate at all times" [DS] together imply declarations-first, but Google never states an approval-before-rollout rule. The recommended order is the conservative one, not a quoted mandate.

### Could not confirm from a primary source

- **The exact Play Console UI wording of the App Access / Sign-in details options.** No Help Center article quotes the radio-button strings; they are visible only in the signed-in Console. The ticket's phrasing "All functionality is available without special access" is plausible but **unverified**. Verify on screen at submission.
- **Any Play-mandated deletion SLA.** There is none. [AD] says only "within a reasonably quick period of time". Any specific day-count you see elsewhere is either GDPR/CCPA (a different legal regime) or a third-party invention. The 90-day figure in [DS] belongs to the auto-deletion badge alternative, not to fulfilling a request.
- **Whether the Data safety form must be *approved* (green check) before a staged rollout begins.** [AD] confirms submissions are *rejected* when the data-deletion answers have unresolved issues, and [DS] confirms review happens as part of app review — but no page states a sequencing rule for a partially-rolled-out release. Treat declarations-first as the safe path.
- **Anything Apple/iOS.** Deliberately out of scope per map #23. Note carried forward there: Google Sign-In on iOS triggers Sign in with Apple plus Apple's own deletion rules.

### Not researched (out of the ticket's scope)

GDPR/DPDP/CCPA obligations, Google's separate **API Services User Data Policy** (which governs the OAuth scopes Google Sign-In requests and is a distinct document from Play policy), Supabase's DPA, and the Families policy (target audience is 13+, no children's data — map #23 already ruled age collection out).
