# Firebase Deployment Guide for Growkub

## Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in to Firebase: `firebase login`

## Deployment Steps

### 1. Build the project
```bash
yarn build
```

### 2. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

## Quick Deploy (All-in-one)
```bash
yarn build && firebase deploy --only hosting
```

## URLs After Deployment
- **Production**: https://growkub-dev.web.app
- **Custom Domain** (if configured): https://growkub.com

## Troubleshooting

### If build fails:
- Make sure all dependencies are installed: `yarn install`
- Clear the cache: `rm -rf .next out`
- Try building again: `yarn build`

### If Firebase login fails:
```bash
firebase logout
firebase login
```

### To check deployment status:
```bash
firebase hosting:sites:list
```

## Notes
- The project is configured for static export (`output: 'export'`)
- All images are set to `unoptimized: true` for hosting compatibility
- Deploy directory is `out` (generated after build)
