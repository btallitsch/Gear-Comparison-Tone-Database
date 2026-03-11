# Gear Comparison & Tone Database

A structured tone documentation tool for musicians. Log guitars, pedals, amps, signal chains, and tone descriptions — then compare setups side by side.

---

## Features

- **Gear Logging** — Document guitars, amps, full pedalboards with types and settings
- **Signal Chain** — Record exact signal path order
- **Tone Descriptions** — Write detailed tone notes for every setup
- **Side-by-Side Comparison** — Compare any two rigs with diff highlights
- **Genre Tagging** — Filter and organize by genre and custom tags
- **Search & Sort** — Full-text search across all gear fields
- **Firebase Auth** — Email/password and Google Sign-In
- **Firestore Backend** — Real-time cloud persistence per user

---

## Tech Stack

- React 18 + TypeScript
- Vite
- Firebase (Firestore + Auth)
- React Router v6
- CSS Modules
- Lucide React (icons)

---

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── AuthForm.tsx          # Login / Register / Password Reset UI
│   │   └── AuthForm.module.css
│   ├── Gear/
│   │   ├── GearCard.tsx          # Single setup display card
│   │   ├── GearCard.module.css
│   │   ├── GearForm.tsx          # Create / Edit setup form
│   │   ├── GearForm.module.css
│   │   ├── ComparisonView.tsx    # Side-by-side comparison table
│   │   └── ComparisonView.module.css
│   ├── Layout/
│   │   ├── Header.tsx            # Nav header
│   │   └── Header.module.css
│   └── UI/
│       ├── Button.tsx / .module.css
│       ├── Input.tsx / .module.css   # Input, Textarea, Select
│       └── Modal.tsx / .module.css
├── contexts/
│   └── AuthContext.tsx           # Firebase auth state context
├── hooks/
│   ├── useAuth.ts                # Auth actions + error handling
│   └── useGear.ts                # Gear CRUD + filter/sort logic
├── pages/
│   ├── Dashboard.tsx             # Overview + recent setups
│   ├── Dashboard.module.css
│   ├── GearDatabase.tsx          # Full setup list with filters
│   ├── GearDatabase.module.css
│   ├── Compare.tsx               # Comparison page
│   └── Compare.module.css
├── services/
│   ├── firebase.ts               # Firebase app init
│   ├── auth.service.ts           # Auth functions
│   └── gear.service.ts           # Firestore CRUD
├── types/
│   └── index.ts                  # All TypeScript interfaces
├── App.tsx                       # Router + auth guard
└── main.tsx
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use an existing one)
3. Enable **Authentication** → Sign-in methods:
   - Email/Password
   - Google
4. Enable **Firestore Database** (start in test mode, then apply the rules below)
5. Go to **Project Settings → Your apps → Add app (Web)**
6. Copy your Firebase config into `src/services/firebase.ts`:

```ts
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### 3. Apply Firestore Security Rules

In Firebase Console → Firestore → Rules, paste the contents of `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gearSetups/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. Run locally

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

---

## Deploying to Firebase Hosting (optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## Example Entry

```
Setup Name: Thrash Rhythm 2024
Guitar:     Charvel Pro-Mod San Dimas
Amp:        Marshall JCM800
Pedals:     Humanoid Encounter (Distortion), ISP Decimator (Noise Gate)
Signal Chain: Guitar → ISP Decimator → Humanoid Encounter → JCM800 FX Return

Tone:
Tight thrash rhythm, aggressive mids. The Humanoid Encounter adds surgical
low-end tightness without losing the natural amp character. Sits perfectly
in a dense mix without clashing with kick drum.

Genre: Thrash
Tags: high-gain, tight, palm-mute, rhythm
```

---

## License

MIT
