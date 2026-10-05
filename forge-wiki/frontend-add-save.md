# Frontend: Add/Save Feature

## Overview

The Save screen (`frontend/components/main/add/Save.js`) is the final step in the post-creation flow. Users land here after capturing a photo or video in the Camera screen and finalize their post by adding a caption before uploading.

## Key Responsibilities

- Displays the captured photo or video for preview
- Lets the user write a caption before uploading (with real-time character count)
- Supports @mention tagging with live user suggestions
- Uploads media to Firebase Storage
- Writes post metadata to Firestore
- Sends push notifications to mentioned users
- Handles errors gracefully with visual feedback

---

## State Management

| State Variable | Type | Purpose |
|---|---|---|
| `caption` | `string` | User-entered caption text (starts as `""`) |
| `uploading` | `boolean` | Controls display of loading spinner; prevents duplicate uploads |
| `error` | `boolean` | Triggers error Snackbar on upload failure |
| `data` | `array` | Firestore query results for @mention user suggestions |
| `keyword` | `string` | Current @mention keyword being typed (e.g., `"@john"`) |

---

## UI Components and Flow

### Caption Input Area

**Component**: `MentionsTextInput` (from `react-native-mentions` library)

- **Placement**: Top of content area in a view with `{ marginBottom: 20, width: '100%' }`
- **Value binding**: Controlled by `caption` state, updated via `onChangeText={setCaption}`
- **Styling**: 
  - Border: `1px solid #ebebeb`
  - Padding: `5px`
  - Font size: `15`
  - Min height: `30`, max height: `80` (expands as user types)
- **@mention support**:
  - Trigger character: `@`
  - Trigger location: `new-word-only` (mentions only at word boundaries)
  - Callback: `callback()` function queries Firestore for matching usernames
  - Suggestions panel shows up to 3 users at a time, styled with semi-transparent gray background

### Character Count Display

**Element**: `<Text style={styles.charCount}>{caption.length} characters</Text>`

- **Styling** (defined in `styles.charCount`):
  - Font size: `12`
  - Color: `'rgba(0,0,0,0.4)'` (semi-transparent gray for secondary appearance)
  - Text alignment: `'right'` (right-aligned)
  - Top margin: `2`

- **Visibility**: Always shown; no maximum character limit enforced
- **Position**: Below caption input

### Media Preview

**Image posts**: `<Image style={{ aspectRatio: 1/1, backgroundColor: 'black' }} source={{ uri: source }} />`

**Video posts**: `<Video source={{ uri: source }} shouldPlay={true} isLooping={true} resizeMode="cover" style={{ aspectRatio: 1/1, backgroundColor: 'black' }} />`

- Media is displayed at 1:1 aspect ratio (square)
- Determined by `props.route.params.type` (0 = video, 1 = photo)
- Video auto-plays and loops

### Navigation Header

- **Right button**: Green checkmark icon (`Feather` "check" icon, 24pt, color green)
- **Action**: Calls `uploadImage()` when pressed
- **Dependency**: `useLayoutEffect` array includes `caption` to update button availability

### Upload Status

- **While uploading**: Full-screen loading state with:
  - Centered `ActivityIndicator` (size "large")
  - Text: "Upload in progress..." (bold, large font)
- **After upload**: Component returns to main feed via `props.navigation.popToTop()`

### Error Handling

- **On upload failure**: `error` state set to `true`
- **Display**: `Snackbar` component shows "Something Went Wrong!"
- **Duration**: Auto-dismiss after 2000ms
- **Recovery**: User can retry

---

## Upload and Save Logic

### Step 1: Media Upload to Cloud Storage

```javascript
const downloadURL = await SaveStorage(props.route.params.source, 
  `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
```

- Fetches media blob from local URI
- Uploads to Firebase Storage under `post/{userId}/{randomId}`
- Returns download URL for Firestore metadata

**For videos**: Also generates and uploads thumbnail:
```javascript
downloadURLStill = await SaveStorage(props.route.params.imageSource, ...)
```

### Step 2: Firestore Post Metadata

Post document written to:
```
posts/{uid}/userPosts/{postId}
```

**Post object**:
```javascript
{
  downloadURL,           // Media file URL
  downloadURLStill,      // (video only) Thumbnail URL
  caption,               // User-entered caption
  type,                  // 0 = video, 1 = photo
  likesCount: 0,
  commentsCount: 0,
  creation: server_timestamp
}
```

### Step 3: @Mention Notifications

1. Regex pattern extracts mentions: `/\B@[a-z0-9_-]+/gi`
2. For each mention, queries Firestore: `where("username", "==", mentionedUsername)`
3. Dispatches `sendNotification()` Redux action for each mentioned user
4. Notification sent to user's stored `notificationToken` via Expo Push API

---

## Redux Integration

**Connected to Redux** via `connect(mapStateToProps, mapDispatchProps)`:

- **`currentUser`** from `store.userState.currentUser` — Used for sender's name in notifications
- **Actions dispatched**:
  - `fetchUserPosts()` — Refreshes user's post feed after successful upload
  - `sendNotification(token, title, body, data)` — Sends push notification to mentioned users

---

## Navigation Parameters

**Received from Camera screen** (`props.route.params`):

| Parameter | Type | Source |
|---|---|---|
| `source` | `string` (URI) | Local file path of captured/selected media |
| `imageSource` | `string` (URI) or `null` | Video thumbnail URI (null for photos) |
| `type` | `number` | 0 = video, 1 = photo |

---

## Styling Notes

- **Inline styles** used for most layout (`marginBottom`, `padding`, `flexDirection`)
- **App-wide shared styles** (`container`, `text`, `utils`, `navbar` from `frontend/components/styles.js`) available but not applied to caption input wrapper
- **Local styles** defined in component via `StyleSheet.create()` for suggestions panel and character count

---

## Key Dependencies

- `react-native-mentions` — @mention text input with autocomplete
- `expo-av` — Video playback
- `firebase` — Firestore and Storage
- `redux` & `react-redux` — State dispatch and mapping
- `react-native-paper` — Snackbar component
- `@expo/vector-icons` — Feather icons (checkmark button)
- `firebase-storage` rules — Govern write access to `post/{uid}/` paths
