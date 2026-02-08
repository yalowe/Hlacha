# Installation & Setup Guide

## Quick Start

### 1. Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd /workspaces/kitzur-app/kitzur
npm install
```

This will install:
- React Native 0.81.5
- Expo ~54.0
- React Navigation
- AsyncStorage
- Expo Clipboard and Sharing
- All other dependencies

### 2. Start Development Server

```bash
npm start
```

This opens the Expo development menu where you can choose your platform:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web Browser

## Platform-Specific Setup

### iOS Development

**Requirements**:
- macOS (required for iOS development)
- Xcode 14+ (install from App Store)
- Command Line Tools: `xcode-select --install`

**Run on iPhone Simulator**:
```bash
npm run ios
```

**Run on Physical iPhone**:
1. Install Expo Go app from App Store
2. Scan QR code from terminal
3. App will load on your device

### Android Development

**Requirements**:
- Android Studio with Android SDK
- Java Development Kit (JDK)
- Android Emulator or physical device

**Setup Android Studio**:
1. Download from: https://developer.android.com/studio
2. Install Android SDK Platform 33+
3. Configure environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

**Run on Android Emulator**:
```bash
npm run android
```

**Run on Physical Android Device**:
1. Enable Developer Options on device
2. Enable USB Debugging
3. Connect via USB
4. Run `npm run android`

Or:
1. Install Expo Go from Play Store
2. Scan QR code from terminal

### Web Development

**Requirements**:
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional setup needed

**Run Web Version**:
```bash
npm run web
```

Opens at `http://localhost:8081`

## Troubleshooting Installation

### Common Issues

**1. npm install fails**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**2. Metro bundler issues**

```bash
# Clear Metro cache
npm start -- --clear

# Or manually:
rm -rf /tmp/metro-*
rm -rf node_modules/.cache
```

**3. iOS build fails**

```bash
# Navigate to iOS directory
cd ios

# Install CocoaPods
pod install

# Go back
cd ..

# Try again
npm run ios
```

**4. Android build fails**

```bash
# Clean Android build
cd android
./gradlew clean

# Go back
cd ..

# Try again
npm run android
```

**5. Web issues**

```bash
# Clear browser cache
# Try incognito/private browsing mode
npm run web
```

## Verifying Installation

After installation, you should see:
- ✅ No errors in terminal
- ✅ Development server running
- ✅ App loads on chosen platform
- ✅ Hebrew text displays correctly (RTL)
- ✅ Navigation works between screens
- ✅ Search functionality works
- ✅ Bookmarks can be added/removed
- ✅ Theme toggle works
- ✅ Text size can be changed

## Environment Variables (Optional)

Create `.env` file in project root for custom configuration:

```bash
# App Configuration
APP_NAME=Kitzur Shulchan Aruch
APP_VERSION=1.0.0

# API URLs (if using remote content)
API_BASE_URL=https://your-api.com

# Analytics (optional)
ANALYTICS_ID=your-analytics-id
```

## Next Steps

After successful installation:

1. **Explore the App**: Navigate through chapters and sections
2. **Test Features**: Try search, bookmarks, sharing
3. **Add Content**: Add more chapters to `content/chapters/`
4. **Customize**: Modify theme, colors, fonts
5. **Build for Production**: Follow deployment guide in README

## Getting Help

If you encounter issues:

1. Check the **README_APP.md** for detailed documentation
2. Look for errors in terminal/console
3. Search existing GitHub issues
4. Create new issue with:
   - Platform (iOS/Android/Web)
   - Error message
   - Steps to reproduce
   - Screenshots if applicable

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- React Native Tools
- TypeScript and JavaScript Language Features

### Debugging

**React Native Debugger**:
- Press `Cmd+D` (iOS) or `Cmd+M` (Android)
- Select "Debug JS Remotely"

**Web Console**:
- Press `F12` or `Cmd+Option+I`
- Check Console, Network, and Application tabs

## Updates

To update dependencies:

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update Expo SDK
npx expo upgrade
```

## Production Build Setup

### For iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Create first build
eas build --platform ios
```

### For Android

```bash
# Configure project
eas build:configure

# Create first build
eas build --platform android
```

### For Web

```bash
# Create production build
npm run web:export

# Output in web-build/
# Deploy to Vercel, Netlify, or Firebase
```

---

**Ready to develop!** 🚀

For full documentation, see [README_APP.md](./README_APP.md)
