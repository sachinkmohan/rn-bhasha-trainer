# Android Deployment Guide - Bhasha Trainer

A step-by-step guide to publishing your first app on Google Play Store.

**Total estimated time: 3-5 hours** (spread across 1-2 days due to Google review)

---

## Table of Contents

1. [Overview & Checklist](#1-overview--checklist)
2. [Prepare Your App Configuration](#2-prepare-your-app-configuration)
3. [Create a Privacy Policy](#3-create-a-privacy-policy)
4. [Prepare Store Assets](#4-prepare-store-assets)
5. [Build Your App with EAS](#5-build-your-app-with-eas)
6. [Set Up Google Play Console](#6-set-up-google-play-console)
7. [Upload & Configure Your App](#7-upload--configure-your-app)
8. [Submit for Review](#8-submit-for-review)
9. [After Publishing](#9-after-publishing)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Overview & Checklist

### What You'll Need

| Item | Status | Notes |
|------|--------|-------|
| Google Play Developer Account | You have this | $25 one-time fee already paid |
| Expo Account (free) | Need to check | For building your app |
| Privacy Policy URL | Need to create | Free options available |
| App Icon (512x512) | Have adaptive icons | May need high-res version |
| Screenshots (phone) | Need to create | Minimum 2, recommended 4-8 |
| Feature Graphic | Need to create | 1024x500 pixels |
| Short Description | Need to write | Max 80 characters |
| Full Description | Need to write | Max 4000 characters |

### The Process in Simple Terms

```
1. Configure your app (app.json)
         |
         v
2. Build an AAB file (Android App Bundle)
         |
         v
3. Create your store listing (screenshots, descriptions)
         |
         v
4. Upload to Google Play Console
         |
         v
5. Fill out required forms (content rating, data safety)
         |
         v
6. Submit for review
         |
         v
7. App goes live! (usually within 1-3 days)
```

---

## 2. Prepare Your App Configuration

**Time: 15-20 minutes**

Before building, you need to update your `app.json` with Play Store requirements.

### Step 2.1: Choose Your Package Name

Your package name is your app's unique identifier on Play Store. It:
- Must be unique across ALL apps on Play Store
- Cannot be changed after publishing
- Format: `com.yourname.appname`

**Recommended for your app:** `com.bhashatrainer.app` or `com.yourname.bhashatrainer`

### Step 2.2: Update app.json

Open `app.json` and update the android section:

```json
{
  "expo": {
    "name": "Bhasha Trainer",
    "slug": "bhasha-trainer",
    "version": "1.0.0",
    "android": {
      "package": "com.bhashatrainer.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png",
        "backgroundColor": "#E6F4FE"
      }
    }
  }
}
```

**Important fields explained:**

| Field | What it is | Example |
|-------|-----------|---------|
| `name` | Display name on Play Store | "Bhasha Trainer" |
| `version` | User-visible version | "1.0.0" |
| `android.package` | Unique app identifier | "com.bhashatrainer.app" |
| `android.versionCode` | Internal version number (must increase with each update) | 1, 2, 3... |

### Step 2.3: Verify Your Icons Exist

Run this command to check your icon files:

```bash
ls -la assets/images/
```

You should see:
- `android-icon-foreground.png` (must be 1024x1024)
- `android-icon-background.png` (must be 1024x1024)
- `icon.png` (must be 1024x1024 for store listing)

**If your icons are smaller than 1024x1024**, you'll need to resize them or create new ones.

---

## 3. Create a Privacy Policy

**Time: 15-30 minutes**

Google Play requires ALL apps to have a privacy policy, even if you don't collect data.

### Option A: Free Privacy Policy Generator (Recommended)

1. Go to [PrivacyPolicies.com](https://www.privacypolicies.com/privacy-policy-generator/) or [FreePrivacyPolicy.com](https://www.freeprivacypolicy.com/free-privacy-policy-generator/)

2. Fill out the form:
   - App name: "Bhasha Trainer"
   - Platform: Mobile app
   - Country: Your country
   - Data collected: Check what applies:
     - **If using Firebase Auth**: "Email addresses" or "Account info"
     - **If using Analytics**: "Usage data"
     - **If no data collection**: Select "No personal data"

3. Generate and download/host the policy

### Option B: Host on GitHub Pages (Free)

1. Create a file `privacy-policy.md` in your repo
2. Enable GitHub Pages in your repo settings
3. Your URL will be: `https://yourusername.github.io/rn-bhasha-trainer/privacy-policy`

### Option C: Use Notion (Free)

1. Create a Notion page with your privacy policy
2. Click "Share" → "Publish to web"
3. Copy the public URL

### Sample Privacy Policy for Your App

```markdown
# Privacy Policy for Bhasha Trainer

Last updated: [DATE]

## Overview
Bhasha Trainer is a language learning app that helps users practice Malayalam pronunciation.

## Data Collection
- **Local Storage**: Your learning progress is stored locally on your device
- **Authentication**: If you create an account, we store your email address to identify your account
- **No Data Sharing**: We do not sell or share your personal information with third parties

## Data Storage
All practice data is stored locally on your device using AsyncStorage. This data never leaves your device unless you explicitly enable cloud sync (coming soon).

## Contact
If you have questions about this privacy policy, contact: [YOUR EMAIL]
```

**Save your privacy policy URL** - you'll need it later.

---

## 4. Prepare Store Assets

**Time: 1-2 hours** (can be done while waiting for builds)

### 4.1: App Icon for Store (512x512)

You likely already have this. The Play Store needs a 512x512 PNG with:
- No transparency
- No rounded corners (Google applies them)

**Check your existing icon:**
```bash
file assets/images/icon.png
```

If it's already 1024x1024, you're good - Play Store will resize it.

### 4.2: Screenshots (REQUIRED)

**Minimum: 2 screenshots | Recommended: 4-8 screenshots**

**Dimensions:**
- Phone: 1080 x 1920 pixels (or 1080 x 2400 for taller phones)
- Aspect ratio: between 16:9 and 9:16

**How to take screenshots:**

#### Option A: From Android Emulator
1. Run your app: `npx expo start --android`
2. In the emulator, press `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac) to save screenshot
3. Screenshots save to your desktop

#### Option B: From Physical Device
1. Run your app on your phone
2. Take screenshots (usually Power + Volume Down)
3. Transfer to your computer

#### Option C: Use a Screenshot Tool (Recommended for polish)
- [AppMockUp](https://app-mockup.com/) - Free, add device frames
- [Previewed](https://previewed.app/) - Free tier available
- [Screenshots.pro](https://screenshots.pro/) - Simple and free

**Recommended screenshots for Bhasha Trainer:**

| Screenshot | What to show |
|------------|-------------|
| 1 | Home screen with progress display |
| 2 | Practice screen with word options |
| 3 | Feedback screen showing correct answer |
| 4 | Results screen with score |
| 5 | Script toggle (Manglish/Malayalam) |

### 4.3: Feature Graphic (REQUIRED)

**Dimensions: 1024 x 500 pixels**

This appears at the top of your Play Store listing.

**Easy ways to create one:**

1. **Canva (Free)**:
   - Go to canva.com
   - Create custom design: 1024 x 500
   - Use a template or create simple design with:
     - App name
     - Tagline ("Learn Malayalam Pronunciation")
     - Simple graphic/icon

2. **Figma (Free)**:
   - Create a 1024x500 frame
   - Add your branding

**Keep it simple:**
```
+--------------------------------------------------+
|                                                  |
|     [App Icon]  Bhasha Trainer                   |
|                 Learn Malayalam Pronunciation    |
|                                                  |
+--------------------------------------------------+
```

### 4.4: Write Your Store Listing Text

#### Short Description (max 80 characters)
This appears in search results. Make every character count!

**Example:**
```
Learn Malayalam pronunciation with fun, bite-sized practice sessions.
```

#### Full Description (max 4000 characters)

**Template:**

```
Master Malayalam pronunciation with Bhasha Trainer!

WHAT IS BHASHA TRAINER?
A simple, effective way to practice Malayalam words and improve your pronunciation. Perfect for beginners learning Malayalam or heritage speakers wanting to reconnect with the language.

KEY FEATURES:
- Practice Sessions: Quick 5-word sessions that fit into your busy schedule
- Dual Script Support: Switch between Manglish (romanized) and Malayalam script
- Progress Tracking: See your words categorized as New, Learning, or Mastered
- Confusable Words: Learn to distinguish similar-sounding Malayalam words
- Instant Feedback: Know immediately if you got it right with explanations

WHO IS THIS FOR?
- Beginners learning Malayalam
- Heritage speakers improving their skills
- Anyone interested in South Indian languages
- Students preparing for Malayalam exams

HOW IT WORKS:
1. Start a practice session
2. Listen to the word (audio coming soon!)
3. Choose between two similar-sounding options
4. Get instant feedback with meaning and explanation
5. Track your progress over time

Start your Malayalam learning journey today!
```

---

## 5. Build Your App with EAS

**Time: 30-45 minutes** (mostly waiting for build)

EAS (Expo Application Services) builds your app in the cloud. No Android Studio needed!

### Step 5.1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 5.2: Log in to Expo

```bash
eas login
```

If you don't have an Expo account, create one at [expo.dev](https://expo.dev) (free).

### Step 5.3: Configure EAS Build

Run this command to create `eas.json`:

```bash
eas build:configure
```

This creates an `eas.json` file. Update it to look like this:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Step 5.4: Build for Production

```bash
eas build --platform android --profile production
```

**What happens:**
1. EAS uploads your code to Expo's build servers
2. Build takes 10-20 minutes
3. You get a download link for your `.aab` file

**First build notes:**
- EAS will ask to create a new Android keystore - **say YES**
- This keystore signs your app. EAS stores it securely for you.
- You can download a backup later if needed

### Step 5.5: Download Your AAB

When the build completes:
1. You'll see a URL in the terminal
2. Or go to [expo.dev](https://expo.dev) → Your project → Builds
3. Download the `.aab` file

**Keep this file!** You'll upload it to Play Console.

---

## 6. Set Up Google Play Console

**Time: 20-30 minutes**

### Step 6.1: Create a New App

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **"Create app"**
3. Fill out the form:

| Field | Value |
|-------|-------|
| App name | Bhasha Trainer |
| Default language | English (US) - or your preference |
| App or game | App |
| Free or paid | Free |
| Declarations | Check all required boxes |

4. Click **"Create app"**

### Step 6.2: Complete the Dashboard Checklist

After creating, you'll see a dashboard with tasks. Complete them in order:

```
Dashboard Tasks:
├── App access (if app needs login)
├── Ads (does your app show ads?)
├── Content rating (questionnaire)
├── Target audience (age groups)
├── News app (are you a news app?)
├── COVID-19 apps (health related?)
├── Data safety (what data you collect)
├── Government apps (government official?)
└── Financial features (money/crypto?)
```

Most of these are simple Yes/No questions. I'll detail the complex ones below.

---

## 7. Upload & Configure Your App

**Time: 45-60 minutes**

### Step 7.1: Set Up App Signing

1. Go to **Release** → **Production** → **Create new release**
2. Google will prompt you about **Play App Signing**
3. Click **"Continue"** to let Google manage your signing key

**Why this matters:** Google adds an extra layer of security to your app. This is recommended and required for new apps.

### Step 7.2: Upload Your AAB File

1. Still in the release screen, find **"App bundles"**
2. Click **"Upload"**
3. Select your `.aab` file from Step 5.5
4. Wait for upload and processing (1-2 minutes)

### Step 7.3: Add Release Notes

In the **"Release notes"** section:

```
Initial release of Bhasha Trainer!

Features:
- Practice Malayalam pronunciation
- Switch between Manglish and Malayalam script
- Track your learning progress
- Learn to distinguish confusable words
```

### Step 7.4: Complete Store Listing

Go to **Grow** → **Store presence** → **Main store listing**

Fill out:

| Section | What to add |
|---------|-------------|
| App name | Bhasha Trainer |
| Short description | Your 80-char description from Step 4.4 |
| Full description | Your full description from Step 4.4 |
| App icon | Upload 512x512 PNG |
| Feature graphic | Upload 1024x500 PNG |
| Phone screenshots | Upload 2-8 screenshots |

Click **"Save"** at the bottom.

### Step 7.5: Complete Content Rating

Go to **Policy** → **App content** → **Content rating**

1. Click **"Start questionnaire"**
2. Answer honestly about your app:
   - Violence? **No**
   - Sexual content? **No**
   - Language? **No** (unless your examples include profanity)
   - Controlled substances? **No**
   - User interaction? **No** (unless you have chat features)

3. Click **"Save"** → **"Submit"**

You'll receive a rating (likely **"Everyone"** or **"E"** for your app).

### Step 7.6: Complete Target Audience

Go to **Policy** → **App content** → **Target audience**

1. Select age groups your app targets
   - If your app is for language learners of all ages: select "13 and above" or "All ages"
   - **Avoid selecting "Under 13"** unless you're compliant with COPPA (children's privacy laws)

2. Click **"Save"**

### Step 7.7: Complete Data Safety

Go to **Policy** → **App content** → **Data safety**

This is the most complex form. Answer based on what your app actually does:

**For Bhasha Trainer:**

| Question | Answer |
|----------|--------|
| Does your app collect or share any user data? | **Yes** (if using Firebase Auth) or **No** (if purely local) |
| Is all data encrypted in transit? | **Yes** (Firebase uses HTTPS) |
| Can users request data deletion? | **Yes** (they can delete their account) |

**Data types collected (if using Firebase Auth):**

| Data type | Collected? | Shared? | Purpose |
|-----------|------------|---------|---------|
| Email address | Yes | No | Account management |
| App activity | Yes (locally) | No | App functionality |

Click **"Save"** → **"Submit"**

### Step 7.8: Add Privacy Policy

Go to **Policy** → **App content** → **Privacy policy**

1. Enter your privacy policy URL from Step 3
2. Click **"Save"**

---

## 8. Submit for Review

**Time: 10 minutes** (then 1-3 days waiting)

### Step 8.1: Final Checklist

Before submitting, verify everything is complete:

Go to **Release** → **Production** and check for any warnings.

**Common issues:**
- Missing screenshots
- Missing privacy policy
- Incomplete content rating
- Missing data safety declaration

### Step 8.2: Review and Roll Out

1. Go to **Release** → **Production**
2. Click on your release (the one with your uploaded AAB)
3. Review all information
4. Click **"Review release"**
5. Click **"Start rollout to Production"**

### Step 8.3: Wait for Review

Google reviews all new apps. Timeline:

| Scenario | Typical Time |
|----------|-------------|
| First app from new developer | 3-7 days |
| Subsequent apps | 1-3 days |
| App updates | Few hours to 1 day |

**You'll receive an email when:**
- Your app is approved and live
- Your app is rejected (with reasons)

---

## 9. After Publishing

### Your App is Live!

Once approved, your app will be available at:
```
https://play.google.com/store/apps/details?id=com.bhashatrainer.app
```

(Replace with your actual package name)

### Share Your App

- Share the Play Store link on social media
- Create a QR code for the link
- Add the link to your portfolio/resume

### Monitor Your App

In Play Console, check:
- **Statistics**: Downloads, active users
- **Ratings & reviews**: Respond to user feedback
- **Crashes & ANRs**: Monitor stability

### Releasing Updates

When you want to release a new version:

1. Update `version` and `versionCode` in `app.json`:
   ```json
   {
     "version": "1.1.0",
     "android": {
       "versionCode": 2
     }
   }
   ```

2. Build again:
   ```bash
   eas build --platform android --profile production
   ```

3. Upload new AAB to Play Console
4. Submit for review

---

## 10. Troubleshooting

### Build Fails

**"Package name already exists"**
- Someone else has that package name. Choose a different one.
- Try: `com.yourname.bhashatrainer` with your actual name

**"Keystore error"**
- Run `eas credentials` to manage your keystore
- Or let EAS create a new one

### Upload Fails

**"Version code already exists"**
- Increment `versionCode` in app.json

**"App signing not set up"**
- Follow the Play App Signing prompts in Play Console

### Review Rejected

**Common rejection reasons:**

| Reason | Solution |
|--------|----------|
| Broken functionality | Fix bugs, retest thoroughly |
| Misleading description | Make description accurate |
| Privacy policy issues | Ensure policy matches actual data use |
| Intellectual property | Remove any copyrighted content |

---

## Quick Reference: Time Estimates

| Step | Time | Can Parallelize? |
|------|------|------------------|
| Update app.json | 15 min | - |
| Create privacy policy | 15-30 min | Yes |
| Create screenshots | 30-60 min | Yes (while building) |
| Create feature graphic | 20-30 min | Yes (while building) |
| Write descriptions | 20-30 min | Yes (while building) |
| Build with EAS | 15-25 min | Build runs in background |
| Set up Play Console | 20-30 min | After build completes |
| Fill out forms | 30-45 min | - |
| Submit & wait | 5 min + 1-3 days | - |

**Optimal flow:**
1. Start EAS build (15 min setup, then wait)
2. While building: Create assets + privacy policy + descriptions
3. When build done: Upload to Play Console
4. Submit and wait

**Total active time: ~3 hours**
**Total elapsed time: 1-3 days** (mostly waiting for review)

---

## Need Help?

- **Expo Documentation**: https://docs.expo.dev/distribution/app-stores/
- **Google Play Help**: https://support.google.com/googleplay/android-developer
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/

---

Good luck with your launch! Remember: Getting your first app published is the hardest part. After this, updates are much simpler!
