# ProofIt — Activity‑first, Proof‑first

ProofIt is a proof‑first social habit app: you start an activity, you finish it, and you prove it with a timestamped photo that can be posted or saved to drafts. Think Strava + Snapchat + BeReal, but built around an activity-first UX.

---

## Core UX (new priority)
- Open to the **Activities** page (default) — quick entry to:
  - Start a Workout (gym session)
  - Start a Run/Walk
  - Start a Focus Session
  - Quick Snap (daily vibe)
- Big center capture button (Instagram/Snapchat style) always accessible for instant proof photos.
- After an activity completes the app prompts you to take or add a photo and attach activity data — or save that post to Drafts.
- Drafts let users finish overlaying stats and post later.
- Plan Maker UI remains visible but marked "In development".

---

# ProofIt - The Complete Development Plan

Alright, here's everything we need to do to ship this thing to the App Store. No fluff, no corporate speak - just the honest checklist of what needs to happen.

---

## What We're Building

A social accountability app where you can't just *say* you did something - you have to prove it with a photo. Every gym session, every run, every study session, every daily check-in gets a timestamped photo with your stats overlaid on it.

---

## Phase 1: Core App (We're Here-ish)

### ✅ Already Done
- [x] Project setup with Expo SDK 54
- [x] Bottom tab navigation with custom floating bar
- [x] Basic screen structure (Home, Feed, Capture, Stats, Profile)
- [x] Theme system (Gemini dark mode colors)
- [x] Pillar selection screen
- [x] Mock feed with placeholder data

### 🔨 Needs Finishing
- [ ] **Camera actually works** - Right now it's a placeholder. Need to implement expo-camera properly with:
  - Front/back camera toggle
  - Flash control
  - Photo capture and preview
  - Retake option
  
- [ ] **Data entry forms for each activity type:**
  - Gym: Exercise picker, weight input, sets × reps counter
  - Run: Auto-pull GPS data, manual distance override
  - Focus: Timer that was running, task description
  - Snap: Mood selector, energy slider, quick note

- [ ] **Photo + Data composition** - The magic part. Take the photo, overlay the stats beautifully, save as one image. This is like 40% of the app's value.

---

## Phase 2: Backend & Auth

### 🔐 User System
- [ ] Pick a backend (Supabase is probably easiest - it's free tier is generous and has auth built in)
- [ ] Email/password signup & login
- [ ] Apple Sign In (required for App Store if you have any social login)
- [ ] Google Sign In (nice to have)
- [ ] Forgot password flow
- [ ] Email verification
- [ ] Profile creation (username, display name, avatar)
- [ ] Delete account (legally required now)

### 💾 Database Schema
Need tables for:
- Users (id, email, username, display_name, avatar_url, created_at)
- Posts (id, user_id, activity_type, image_url, caption, data_json, location, created_at)
- Follows (follower_id, following_id)
- Likes (user_id, post_id)
- Comments (id, user_id, post_id, text, created_at)
- Streaks (user_id, activity_type, current_streak, longest_streak, last_activity)

### 📸 Image Storage
- [ ] Set up cloud storage (Supabase Storage, Cloudinary, or AWS S3)
- [ ] Image upload on post creation
- [ ] Image compression before upload (users don't need 12MB photos)
- [ ] CDN for fast image loading

---

## Phase 3: The Social Stuff

### 📰 Feed
- [ ] Real feed pulling from database
- [ ] Pull to refresh
- [ ] Infinite scroll / pagination
- [ ] Feed filtering (all, friends only, by activity type)
- [ ] Post detail view

### ❤️ Interactions
- [ ] Like/unlike posts
- [ ] Comments system
- [ ] Share to Instagram/Twitter/etc
- [ ] Copy link to post
- [ ] Report post (required for App Store)
- [ ] Block user (required for App Store)

### 👥 Social Graph
- [ ] Follow/unfollow users
- [ ] Followers/following lists
- [ ] User search
- [ ] Suggested users to follow
- [ ] Private vs public accounts (maybe v2?)

---

## Phase 4: The Tracking Features

### 🏋️ Gym
- [ ] Exercise database (or let users type custom)
- [ ] Weight unit toggle (lbs/kg)
- [ ] Set logging with rest timer
- [ ] PR (personal record) detection and celebration
- [ ] Workout templates (save & reuse)

### 🏃 Run
- [ ] GPS tracking with expo-location
- [ ] Real-time distance/pace display
- [ ] Route map on completed runs
- [ ] Background location (tricky on iOS)
- [ ] Pause/resume tracking
- [ ] Auto-pause when stopped

### 🧠 Focus
- [ ] Pomodoro timer (25/5 or custom)
- [ ] Session tracking
- [ ] Focus score calculation
- [ ] "Do Not Disturb" reminder
- [ ] Session history

### ✨ Snap (Daily)
- [ ] Mood picker (emoji wheel?)
- [ ] Energy level (1-5 or slider)
- [ ] Gratitude prompt
- [ ] One-tap quick post option

---

## Phase 5: Gamification & Retention

### 🔥 Streaks
- [ ] Daily streak tracking per activity type
- [ ] Overall consistency streak
- [ ] Streak freeze (miss a day without breaking streak - earned or purchased?)
- [ ] Streak milestones (7 days, 30 days, 100 days, 365 days)
- [ ] Streak recovery (pay to restore?)

### 🏆 Achievements
- [ ] Achievement system infrastructure
- [ ] "First Post" achievement
- [ ] Activity-specific achievements (first 100lb lift, first 5k, etc)
- [ ] Social achievements (first follower, 100 likes received)
- [ ] Streak achievements
- [ ] Achievement display on profile

### 📊 Stats & Insights
- [ ] Weekly summary
- [ ] Monthly recap
- [ ] Year in review
- [ ] Progress charts
- [ ] Personal records list
- [ ] Comparison to previous periods

---

## Phase 6: Notifications

### 🔔 Push Notifications
- [ ] Set up push notification service (Expo Push or OneSignal)
- [ ] New follower notification
- [ ] Post liked notification
- [ ] Comment notification  
- [ ] Streak at risk reminder (evening if you haven't posted)
- [ ] Streak milestone celebration
- [ ] Friend posted notification (optional)
- [ ] Weekly recap notification

### ⚙️ Notification Preferences
- [ ] Granular notification settings
- [ ] Quiet hours
- [ ] Per-notification-type toggles

---

## Phase 7: Polish & UX

### ✨ Animations
- [ ] Screen transitions
- [ ] Button press feedback
- [ ] Pull to refresh animation
- [ ] Like heart animation
- [ ] Streak flame animation
- [ ] Loading skeletons (not spinners)
- [ ] Haptic feedback throughout

### 🎨 Visual Polish
- [ ] Empty states for all screens
- [ ] Error states
- [ ] Loading states
- [ ] Onboarding flow (first launch)
- [ ] Tutorial tooltips
- [ ] App icon (multiple options)
- [ ] Splash screen animation

### 📱 Platform Specific
- [ ] iOS safe areas
- [ ] Android back button handling
- [ ] Tablet layout (or at least not broken)
- [ ] Landscape handling (probably just disable it)
- [ ] Dark/light mode (or just dark only?)

---

## Phase 8: Testing

### 🧪 Before Submission
- [ ] Test on real iPhone (not just simulator)
- [ ] Test on real Android phone
- [ ] Test on older devices (iPhone 11, etc)
- [ ] Test on different screen sizes
- [ ] Test offline behavior
- [ ] Test poor network conditions
- [ ] Test with 1000+ posts (performance)
- [ ] Memory leak testing
- [ ] Battery drain testing (especially GPS)
- [ ] TestFlight beta with real users (at least 10 people)
- [ ] Fix all crashes from beta

---

## Phase 9: Legal & Compliance

### 📜 Required Documents
- [ ] Privacy Policy (where data is stored, what we collect)
- [ ] Terms of Service
- [ ] EULA if needed
- [ ] GDPR compliance (if available in EU)
- [ ] CCPA compliance (if available in California)
- [ ] Age verification/restriction (13+ probably)

### 🛡️ Safety Features (Apple requires these)
- [ ] Block users
- [ ] Report content
- [ ] Report users
- [ ] Content moderation plan
- [ ] Hide/delete own content

---

## Phase 10: App Store Submission

### 🍎 Apple App Store
- [ ] Apple Developer Account ($99/year)
- [ ] App Store Connect setup
- [ ] App name (check it's not taken)
- [ ] App description (detailed, keyword-rich)
- [ ] Screenshots for all iPhone sizes (6.7", 6.5", 5.5")
- [ ] Screenshots for iPad (if supporting)
- [ ] App preview video (optional but helps)
- [ ] Keywords
- [ ] Category selection
- [ ] Age rating questionnaire
- [ ] Privacy nutrition labels (what data you collect)
- [ ] Review notes (explain app to reviewer)
- [ ] Demo account for reviewers
- [ ] Contact info for App Review
- [ ] Build with EAS Build
- [ ] Submit and pray

### 🤖 Google Play Store
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Play Console setup
- [ ] Store listing
- [ ] Screenshots for phone and tablet
- [ ] Feature graphic (1024x500)
- [ ] Content rating questionnaire
- [ ] Data safety form
- [ ] Target audience declaration
- [ ] Build AAB with EAS Build
- [ ] Internal testing track first
- [ ] Production release

---

## Phase 11: Launch & Beyond

### 🚀 Launch Checklist
- [ ] Analytics setup (Mixpanel, Amplitude, or Firebase)
- [ ] Crash reporting (Sentry or Bugsnag)
- [ ] Performance monitoring
- [ ] Server scaling plan
- [ ] Customer support email/system
- [ ] Social media accounts
- [ ] Landing page / website
- [ ] Press kit

### 📈 Post-Launch
- [ ] Monitor crash reports daily
- [ ] Respond to App Store reviews
- [ ] Fix critical bugs ASAP
- [ ] Plan v1.1 based on feedback
- [ ] User interviews
- [ ] A/B testing infrastructure

---

## Rough Timeline (Being Realistic)

| Phase | Time Estimate | Notes |
|-------|--------------|-------|
| Phase 1-2 | 3-4 weeks | Core app + backend |
| Phase 3-4 | 3-4 weeks | Social + tracking features |
| Phase 5-6 | 2 weeks | Gamification + notifications |
| Phase 7 | 2 weeks | Polish (always takes longer) |
| Phase 8 | 2 weeks | Testing + beta |
| Phase 9-10 | 1-2 weeks | Legal + submission |

**Total: ~3-4 months** if working on this full-time  
**Total: ~6-8 months** if nights/weekends only

---

## Tech Stack Summary

- **Framework:** React Native + Expo SDK 54
- **Navigation:** Expo Router
- **Styling:** NativeWind (Tailwind)
- **State:** Zustand
- **Backend:** Supabase (Auth + Database + Storage)
- **Notifications:** Expo Notifications
- **Analytics:** Mixpanel
- **Crashes:** Sentry
- **Build:** EAS Build

---

## Running Locally

```bash
npm install
npx expo start
```

Then scan QR with Expo Go on your phone.

---

*Last updated: January 2026*

*Let's build this thing.* 💪
