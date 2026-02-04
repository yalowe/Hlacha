# Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.log statements in production code
- [ ] All components have proper prop types
- [ ] All functions have JSDoc comments
- [ ] Code follows style guide
- [ ] All files have proper imports

### Testing
- [ ] Tested on iOS Simulator
- [ ] Tested on Android Emulator
- [ ] Tested on web browser (Chrome, Safari, Firefox)
- [ ] Tested on physical iPhone device
- [ ] Tested on physical Android device
- [ ] All navigation flows work
- [ ] Search functionality works
- [ ] Bookmarks save and load correctly
- [ ] Theme toggle works properly
- [ ] Text scaling applies correctly
- [ ] Share functionality works
- [ ] Copy to clipboard works
- [ ] RTL text displays correctly
- [ ] Dark mode displays correctly

### Content
- [ ] All chapter JSON files are valid
- [ ] Hebrew text displays properly
- [ ] No typos or errors in content
- [ ] All chapter IDs registered in contentLoader.ts
- [ ] Content sources verified
- [ ] Version numbers set correctly

### Configuration
- [ ] App name updated in app.json
- [ ] Bundle identifier set correctly
- [ ] Version number finalized
- [ ] Build number incremented
- [ ] App icons created and placed
- [ ] Splash screen created
- [ ] Privacy policy written
- [ ] Terms of service written

## iOS Deployment

### Preparation
- [ ] Apple Developer account active
- [ ] Xcode installed and updated
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into Expo account
- [ ] App Store Connect app created
- [ ] Bundle ID matches configuration

### Build Configuration
- [ ] Run `eas build:configure`
- [ ] Update eas.json with correct settings
- [ ] Set up provisioning profiles
- [ ] Configure certificates
- [ ] Set production environment variables

### App Store Assets
- [ ] App icon (1024x1024 PNG)
- [ ] Screenshots (all required sizes)
- [ ] App preview video (optional)
- [ ] App description written
- [ ] Keywords researched
- [ ] Category selected
- [ ] Age rating set
- [ ] Privacy policy URL added
- [ ] Support URL added

### Build & Submit
- [ ] Run `eas build --platform ios --profile production`
- [ ] Download .ipa file
- [ ] Upload to App Store Connect
- [ ] Fill in all metadata
- [ ] Submit for review
- [ ] Wait for approval

### TestFlight (Optional)
- [ ] Add internal testers
- [ ] Add external testers
- [ ] Collect feedback
- [ ] Fix reported issues
- [ ] Update build if needed

## Android Deployment

### Preparation
- [ ] Google Play Developer account active
- [ ] Android Studio installed
- [ ] EAS CLI installed
- [ ] Google Play Console app created
- [ ] Package name matches configuration

### Build Configuration
- [ ] Configure eas.json for Android
- [ ] Set up signing key
- [ ] Configure build variants
- [ ] Set production environment variables

### Google Play Assets
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (all required sizes)
- [ ] Promo video (optional)
- [ ] Short description
- [ ] Full description
- [ ] Category selected
- [ ] Content rating completed
- [ ] Privacy policy URL added

### Build & Submit
- [ ] Run `eas build --platform android --profile production`
- [ ] Download .aab file
- [ ] Upload to Google Play Console
- [ ] Fill in all metadata
- [ ] Set up pricing & distribution
- [ ] Submit for review
- [ ] Wait for approval

### Internal Testing (Optional)
- [ ] Create internal test track
- [ ] Add testers
- [ ] Distribute build
- [ ] Collect feedback
- [ ] Fix issues

## Web Deployment

### Build
- [ ] Run `npm run web:export`
- [ ] Verify web-build/ directory created
- [ ] Test build locally
- [ ] Check for console errors
- [ ] Verify all routes work
- [ ] Test on different browsers

### Hosting Setup

#### Vercel
- [ ] Install Vercel CLI (`npm i -g vercel`)
- [ ] Run `vercel` in project directory
- [ ] Connect to Git repository (optional)
- [ ] Configure domain
- [ ] Set environment variables
- [ ] Deploy production build
- [ ] Verify deployment

#### Netlify
- [ ] Create Netlify account
- [ ] Connect Git repository
- [ ] Set build command: `npm run web:export`
- [ ] Set publish directory: `web-build`
- [ ] Configure domain
- [ ] Set environment variables
- [ ] Deploy
- [ ] Verify deployment

#### Firebase Hosting
- [ ] Install Firebase CLI (`npm i -g firebase-tools`)
- [ ] Run `firebase init hosting`
- [ ] Set public directory to `web-build`
- [ ] Configure rewrites for SPA
- [ ] Run `firebase deploy`
- [ ] Verify deployment

### PWA Configuration (Optional)
- [ ] Create manifest.json
- [ ] Add service worker
- [ ] Configure caching strategy
- [ ] Test offline functionality
- [ ] Verify installability

### Domain & SSL
- [ ] Purchase domain (if needed)
- [ ] Configure DNS settings
- [ ] Set up SSL certificate
- [ ] Test HTTPS
- [ ] Configure redirects (www to non-www or vice versa)

## Post-Deployment

### Monitoring
- [ ] Set up analytics (Google Analytics, Mixpanel, etc.)
- [ ] Configure error tracking (Sentry, Bugsnag)
- [ ] Monitor app performance
- [ ] Track user engagement
- [ ] Monitor crash reports

### Marketing
- [ ] Create social media accounts
- [ ] Share on relevant platforms
- [ ] Reach out to Torah learning communities
- [ ] Create promotional materials
- [ ] Submit to app review sites

### User Support
- [ ] Set up support email
- [ ] Create FAQ document
- [ ] Prepare support scripts
- [ ] Set up feedback mechanism
- [ ] Plan update schedule

### Maintenance
- [ ] Schedule regular content updates
- [ ] Plan feature additions
- [ ] Monitor user feedback
- [ ] Fix bugs promptly
- [ ] Keep dependencies updated
- [ ] Test new iOS/Android versions

## Version Updates

### Preparing Updates
- [ ] Increment version number in app.json
- [ ] Update build number
- [ ] Create changelog
- [ ] Test new features thoroughly
- [ ] Update documentation
- [ ] Notify beta testers

### Releasing Updates

#### iOS
- [ ] Build new version
- [ ] Upload to App Store Connect
- [ ] Add "What's New" text
- [ ] Submit for review
- [ ] Notify users after approval

#### Android
- [ ] Build new version
- [ ] Upload to Google Play Console
- [ ] Add release notes
- [ ] Choose rollout percentage
- [ ] Monitor for issues
- [ ] Increase rollout gradually

#### Web
- [ ] Build new version
- [ ] Test thoroughly
- [ ] Deploy to hosting
- [ ] Clear CDN cache if needed
- [ ] Notify users

## Emergency Procedures

### Critical Bug
- [ ] Identify and reproduce issue
- [ ] Create hotfix branch
- [ ] Fix bug
- [ ] Test thoroughly
- [ ] Build emergency update
- [ ] Fast-track app store review
- [ ] Deploy immediately

### Server Issues (if using backend)
- [ ] Check server status
- [ ] Review error logs
- [ ] Implement fix
- [ ] Deploy update
- [ ] Monitor recovery

### Content Errors
- [ ] Identify incorrect content
- [ ] Create corrected JSON file
- [ ] Test changes
- [ ] Deploy update
- [ ] Notify users if significant

## Compliance

### Legal
- [ ] Privacy policy reviewed by lawyer
- [ ] Terms of service finalized
- [ ] Copyright notices included
- [ ] Proper attributions given
- [ ] Content rights verified

### App Store Requirements
- [ ] iOS Human Interface Guidelines followed
- [ ] Android Material Design followed
- [ ] Web accessibility standards met
- [ ] GDPR compliance (if applicable)
- [ ] COPPA compliance (if applicable)

### Religious Content
- [ ] Content reviewed by Torah scholars
- [ ] Sources properly attributed
- [ ] Halachic rulings verified
- [ ] Disclaimer added if needed

## Success Metrics

### Track These KPIs
- [ ] Number of downloads
- [ ] Daily active users
- [ ] Monthly active users
- [ ] Session duration
- [ ] Sections viewed per session
- [ ] Search usage
- [ ] Bookmark usage
- [ ] Share actions
- [ ] App rating
- [ ] User reviews
- [ ] Crash-free rate
- [ ] App performance metrics

## Continuous Improvement

### Regular Tasks
- [ ] Weekly: Check analytics
- [ ] Weekly: Respond to reviews
- [ ] Bi-weekly: Review crash reports
- [ ] Monthly: Update content
- [ ] Monthly: Security updates
- [ ] Quarterly: Major feature releases
- [ ] Yearly: Full app review

### User Feedback
- [ ] Collect feature requests
- [ ] Prioritize improvements
- [ ] Plan development roadmap
- [ ] Communicate with users
- [ ] Implement requested features

---

## Quick Launch Commands

### iOS
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### Android
```bash
eas build --platform android --profile production
eas submit --platform android
```

### Web
```bash
npm run web:export
vercel --prod
```

---

**Remember**: Always test thoroughly before deploying to production!

**Good luck with your deployment!** 🚀
