# Architecture Decisions

## Components and Communication

### Frontend (React Native + Expo)

The mobile client is a React Native application distributed via Expo, supporting both iOS and Android platforms.

**Main structure** (`frontend/App.js`):
- Stack navigator using `@react-navigation/stack` for screen management
- Redux state management (via `redux` and `redux-thunk`) for centralized user data
- Firebase client library (v8.2.3) for auth, Firestore, and Storage
- Tab navigation (`@react-navigation/material-bottom-tabs`) for main app sections

**Key screens** (in `frontend/components/`):
- **Auth screens**: Login, Register (`frontend/components/auth/`)
- **Main section** (`frontend/components/Main.js`): Feed, Search, Camera, Chat, Profile via tab navigation
- **Feature screens**: Post, Comment, Chat, Profile edit, Camera capture, Save
- **Post creation flow**: Camera → Save (captions, mentions, upload)

**State management** (`frontend/redux/`):
- `reducers/user.js` — Current user data
- `reducers/users.js` — Data for followed users
- `actions/index.js` — Async actions dispatched via Redux Thunk

**Notification handling** (`frontend/redux/actions/index.js`):
- Expo Push Notifications integration via `expo-notifications`
- Notification tokens stored in Firestore user documents
- Three notification types: post likes (type 0), direct messages (type 1), profile actions (type 2)

### Admin Panel (React)

A web-based dashboard built with Create React App, using React Router for navigation and Material-UI for UI components.

**Key components** (`admin/src/components/`):
- `Home.js` — Main dashboard page
- `User.js`, `Users.js` — User management views
- `Post.js` — Post management
- `Ride.js` — Additional feature management
- Firebase client initialization (`admin/src/config/`)

**Purpose**: Administrative oversight and content management without direct user functionality.

### Backend (Node.js Firebase Cloud Functions)

Server-side business logic runs as Firebase Cloud Functions (`backend/functions/index.js`).

**Trigger-based operations**:
- `addLike` / `removeLike` — Auto-increment/decrement post `likesCount` on like document creation/deletion
- `addFollower` / `removeFollower` — Auto-update user `followersCount` and `followingCount`
- `addComment` — Auto-increment post `commentsCount` on comment creation

These functions enforce atomic counter updates and maintain data consistency without client-side race conditions.

---

## Data Stores

### Firestore Database

Data is organized in a hierarchical collection structure:

```
users/{uid}
  • username, name, image, bio
  • followersCount, followingCount
  • notificationToken (for push notifications)
  • banned (account suspension flag)

posts/{uid}/userPosts/{postId}
  • downloadURL, downloadURLStill (video thumbnail)
  • caption, type (0=video, 1=photo)
  • likesCount, commentsCount
  • creation (server timestamp)

posts/{uid}/userPosts/{postId}/likes/{userId}
  • (document existence indicates a like)

posts/{uid}/userPosts/{postId}/comments/{userId}
  • text, creation

following/{uid}/userFollowing/{followingUid}
  • (document existence indicates following relationship)

chats/{chatId}
  • users (array of two UIDs)
  • lastMessageTimestamp

chats/{chatId}/messages/{messageId}
  • text, senderId, timestamp

admin/{documents}
  • (write disabled; for admin role tracking)
```

### Cloud Storage

Media organized by user and post:

```
gs://bucket/profile/{uid}/
  • User profile images

gs://bucket/post/{uid}/{postId}
  • Photo and video files for user's posts
```

---

## Hosting and Deployment

### Frontend (Mobile App)
- **Platform**: Expo-managed service
- **Distribution**: Runs on iOS via native build or Android via native build; also supports web
- **Configuration**: `frontend/app.json` specifies app metadata, splash screen, and platform-specific settings (Android package, iOS bundle ID, Google Sign-In keys)
- **Firebase config**: Embedded in runtime (`frontend/App.js`) with credentials loaded from environment

### Admin Panel
- **Platform**: Standard React SPA (Create React App)
- **Run command**: `npm start` (development), `npm run build` (production)
- **Deployment**: Static hosting (requires external CDN or server)

### Backend
- **Platform**: Google Cloud Functions (Firebase)
- **Runtime**: Node.js
- **Triggers**: Firestore document events (onCreate, onDelete)
- **Deployment**: Via Firebase CLI (`firebase deploy --only functions`)

### Database & Storage
- **Firestore**: Google Cloud Firestore (serverless NoSQL)
- **Storage**: Google Cloud Storage via Firebase Storage SDK
- **Security**: Controlled via Firestore and Storage rules files (`firestore_rules.txt`, `storage_rules.txt`)

---

## Notable Libraries and Rationale

### Frontend Dependencies

**Navigation & UI**:
- `@react-navigation/*` (stack, tabs, material) — Industry-standard React Native navigation
- `react-native-vector-icons` — Icon library (Feather, MaterialCommunityIcons)
- `react-native-elements`, `react-native-paper` — UI component libraries

**Media**:
- `expo-camera` — Camera capture (photo/video)
- `expo-image-picker` — Gallery selection
- `expo-media-library` — Device media access
- `expo-video-thumbnails`, `expo-av` — Video handling
- `expo-video-player` — Video playback

**State & Async**:
- `redux`, `redux-thunk` — Predictable state management with side-effects
- `react-redux` — React bindings for Redux

**Communication**:
- `firebase@8.2.3` — Auth, Firestore, Storage client
- `expo-notifications` — Push notification handling
- Sentry error reporting integration

**Utilities**:
- `react-native-mentions` — @mention text input with suggestions
- `react-native-reanimated` — Animation library
- `react-uuid` — UUID generation
- `react-native-bottomsheet-reanimated` — Modal/bottom sheet UI

**Chosen because**: Firebase SDKs provide serverless integration without backend infrastructure; Expo handles cross-platform build complexity; Redux enables centralized data consistency for real-time feeds.

### Admin Dependencies

- `@material-ui/core`, `@material-ui/icons`, `@material-ui/data-grid` — Material Design components and admin tables
- `react-router-dom` — Client-side routing
- `firebase@8.2.5`, `firebase-admin@9.4.2` — Firebase client and admin SDKs
- Standard Create React App tooling (`react-scripts`)

### Backend

- `firebase-functions` — Cloud Functions SDK
- `firebase-admin` — Admin SDK for Firestore/Storage operations

---

## Cross-Platform Communication

**Frontend → Backend**:
- Frontend writes to Firestore (posts, likes, comments, chats, follows)
- Cloud Functions listen to Firestore events and update counters/indexes
- Frontend subscribed to real-time Firestore listeners (Redux actions) to sync state

**Frontend → Push Notifications**:
- Backend calls Expo push notification API (`https://exp.host/--/api/v2/push/send`) with user's notification token
- Tokens stored per user in Firestore (`users/{uid}.notificationToken`)

**Admin → Firestore**:
- Admin panel queries and modifies Firestore directly; can bypass some client-side restrictions via Firestore rules admin role check

---

## Data Flow Example: Creating a Post

1. User captures photo/video in Camera screen (`frontend/components/main/add/Camera.js`)
2. User writes caption and confirms in Save screen (`frontend/components/main/add/Save.js`)
3. Frontend uploads media to Cloud Storage (`post/{uid}/{randomId}`)
4. Frontend writes post metadata to `posts/{uid}/userPosts/{postId}` in Firestore
5. Frontend extracts @mentions from caption and queries `users` collection for mentioned usernames
6. Frontend calls backend via `sendNotification` action to post to Expo API
7. Mentioned users receive push notification with post link
8. Other users following this user see post in feed (real-time Firestore query in `Main.js` → `fetchUserFollowing()` → `fetchUsersFollowingPosts()`)
