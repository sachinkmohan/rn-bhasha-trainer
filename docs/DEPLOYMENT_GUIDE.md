# 🚀 Deployment Guide - Bhasha Sakhi

A step-by-step guide for developing, committing, and deploying your app to Google Play Store.

---

## 📋 Table of Contents
1. [Development Workflow](#development-workflow)
2. [Git Commands](#git-commands)
3. [Building for Production](#building-for-production)
4. [Submitting to Google Play](#submitting-to-google-play)
5. [Troubleshooting](#troubleshooting)

---

## 🛠️ Development Workflow

### 1. Start a New Feature

Always work on a new branch:

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Examples:
# git checkout -b feature/add-vocabulary
# git checkout -b fix/audio-playback
# git checkout -b update/ui-improvements
```

### 2. During Development

```bash
# Start the development server
npx expo start

# Run on Android emulator
npx expo start --android

# Run on iOS simulator (Mac only)
npx expo start --ios

# Clear cache if needed
npx expo start --clear
```

### 3. Test Your Changes

Before committing, make sure:
- ✅ App runs without errors
- ✅ Features work as expected
- ✅ No console errors/warnings
- ✅ Test on both Manglish and Malayalam scripts

---

## 💾 Git Commands

### Check Status

```bash
# See what files changed
git status

# See detailed changes
git diff
```

### Stage and Commit Changes

```bash
# Stage specific files
git add path/to/file.tsx

# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "feat: add vocabulary practice mode"

# Examples of good commit messages:
# git commit -m "feat: add audio playback feature"
# git commit -m "fix: resolve pronunciation display issue"
# git commit -m "update: improve UI spacing on home screen"
# git commit -m "docs: update deployment guide"
```

### Push to Remote

```bash
# Push your branch to GitHub
git push origin feature/your-feature-name

# If it's your first push on this branch
git push -u origin feature/your-feature-name
```

### Merge to Main

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature branch
git merge feature/your-feature-name

# Push to remote
git push origin main

# Delete the feature branch (optional)
git branch -d feature/your-feature-name
```

---

## 🏗️ Building for Production

### Step 1: Prepare for Build

1. **Update version number** (optional):
   - Google Play Console will auto-increment if `autoIncrement: true` is set in `eas.json`
   - Or manually update version in `app.json`:
     ```json
     "version": "1.0.1"
     ```

2. **Commit all changes**:
   ```bash
   git add .
   git commit -m "chore: prepare for release v1.0.1"
   git push origin main
   ```

### Step 2: Build the App

```bash
# Build for Android (production)
eas build --platform android --profile production
```

**What happens:**
- ✅ EAS compiles your app
- ✅ Creates an Android App Bundle (.aab)
- ✅ Generates deobfuscation file (ProGuard mapping)
- ✅ Stores everything on Expo servers
- ⏱️ Takes 5-15 minutes

**Output:**
```
✔ Build completed!
Download: https://expo.dev/accounts/[account]/builds/[build-id]
```

### Step 3: Wait for Build to Complete

- You'll get a notification when done
- Check status at: https://expo.dev

---

## 📦 Submitting to Google Play

### Automatic Submission (Recommended)

```bash
# Submit to Google Play Console
eas submit --platform android --profile production
```

**What happens:**
- ✅ Downloads your built .aab file
- ✅ Uploads to Google Play Console (Internal Testing track)
- ✅ Uploads deobfuscation file automatically
- ✅ Uses credentials from `credentials/bhasha-sakhi-*.json`
- ⏱️ Takes 1-2 minutes

**Output:**
```
✔ Successfully submitted to Google Play Console
View in console: https://play.google.com/console/...
```

### Manual Submission (Alternative)

If automatic submission fails:

1. **Download the .aab file** from Expo dashboard
2. **Go to Google Play Console**: https://play.google.com/console
3. **Navigate to**: Your App > Release > Internal testing > Create new release
4. **Upload** the .aab file
5. **Upload** the mapping.txt (deobfuscation file) from Expo dashboard
6. **Fill in** release notes
7. **Click** "Review release" then "Start rollout"

---

## 🔄 Complete Workflow Summary

### For Every Development Cycle:

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and test
npx expo start

# 3. Commit changes
git add .
git commit -m "feat: add new feature"

# 4. Push to remote
git push origin feature/new-feature

# 5. Merge to main (after testing)
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main

# 6. Build for production
eas build --platform android --profile production

# 7. Wait for build (5-15 min)
# Check: https://expo.dev

# 8. Submit to Play Store
eas submit --platform android --profile production

# 9. Check Google Play Console
# View: https://play.google.com/console
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear local cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
eas build --platform android --profile production
```

### Submit Fails

**Error: "Service account authentication failed"**
- Check that `credentials/bhasha-sakhi-*.json` exists
- Verify the file path in `eas.json` is correct
- Ensure service account has proper permissions in Google Play Console

**Error: "Version code already exists"**
- EAS should auto-increment, but if not:
- Increment version code manually in `app.json`
- Or set `autoIncrement: true` in `eas.json`

### Metro Bundler Issues

```bash
# Kill all Metro processes
npx react-native start --reset-cache

# Or manually:
pkill -f "expo" || true
pkill -f "metro" || true
npx expo start --clear
```

### Git Conflicts

```bash
# If merge conflicts occur
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "merge: resolve conflicts"
```

---

## 📝 Best Practices

### Commit Messages

Use conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `update:` - Update existing feature
- `docs:` - Documentation changes
- `style:` - UI/styling changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add pronunciation practice mode"
git commit -m "fix: resolve audio playback on Android"
git commit -m "update: improve home screen layout"
```

### Before Every Release

- ✅ Test all features thoroughly
- ✅ Check console for errors/warnings
- ✅ Test on both Android and iOS (if applicable)
- ✅ Update version number (if needed)
- ✅ Commit all changes
- ✅ Build and test the production build

### Branch Naming

- `feature/*` - New features
- `fix/*` - Bug fixes
- `update/*` - Updates to existing features
- `docs/*` - Documentation
- `hotfix/*` - Urgent fixes

---

## 📞 Quick Reference

### Essential Commands

```bash
# Development
npx expo start                    # Start dev server
npx expo start --android          # Run on Android

# Git
git status                        # Check status
git add .                         # Stage all changes
git commit -m "message"           # Commit
git push origin branch-name       # Push

# Production
eas build --platform android --profile production    # Build
eas submit --platform android --profile production   # Submit

# Useful
git log --oneline                 # See commit history
git branch                        # List branches
git checkout branch-name          # Switch branches
```

---

## 🔗 Useful Links

- **Expo Dashboard**: https://expo.dev
- **Google Play Console**: https://play.google.com/console
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **EAS Submit Docs**: https://docs.expo.dev/submit/introduction/

---

**Last Updated**: January 2026
**App Version**: 1.0.0
**React Native**: 0.81.5
**Expo SDK**: 54
