# Stock Scorcher Android App — Native Mobile Build

This project is intentionally separate from the Stock Scorcher website frontend.

## Architecture
- Native Android UI; no Capacitor/WebView/website bundle.
- Shared Firebase Authentication account with the website.
- Shared Firestore purchase and membership records.
- Shared Stock Scorcher backend payment order + verification endpoints.
- Native Razorpay Android Checkout for app purchases.

## Build
Open the `android` folder in Android Studio and let Gradle sync. Then run:

```powershell
.\gradlew.bat clean assembleDebug
```

The debug APK will be generated at:

`app/build/outputs/apk/debug/app-debug.apk`

## Notes
- The app uses the existing Stock Scorcher Firebase project and backend payment endpoints found in the supplied project.
- The Android app does not load the website bundle.
- Course and membership ownership is read from the same Firestore documents used by the website.
- Purchases made in the app write the same purchase/membership records after backend payment verification.
