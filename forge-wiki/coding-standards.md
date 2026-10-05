# Coding Standards

## Languages and Tooling

### Frontend

- **Language**: JavaScript (ES6+) with React Native
- **Build tool**: Expo CLI (managed service; `frontend/App.js` is entry point)
- **Transpiler**: Babel with `babel-preset-expo` (`frontend/babel.config.js`)
- **Package manager**: npm
- **Testing framework**: Jest + `@testing-library/react-native` (`frontend/package.json` jest config: preset `"jest-expo"`)
- **Linting**: ESLint is available via `@babel/core` and Babel ecosystem but no explicit `.eslintrc` in repo

### Admin

- **Language**: JavaScript (ES6+) with React
- **Build tool**: Create React App (via `react-scripts`)
- **Package manager**: npm
- **Testing framework**: Jest + React Testing Library (standard CRA setup)
- **Linting**: ESLint via Create React App (no custom config visible)

### Backend

- **Language**: Node.js JavaScript
- **Runtime**: Firebase Cloud Functions
- **No explicit linting/formatting config present**

---

## Formatting and Linting

**No dedicated linting or formatting config found** in the repository:
- No `.eslintrc`, `.prettierrc`, or similar files
- No formatter integration (e.g., Prettier) visible in configs
- Code style is mixed across files (some functions use inline styles, others import from shared style sheets)

**Observed patterns** (de facto standards from code review):

- **Indentation**: 4 spaces (observed in most `.js` files)
- **Semicolons**: Present but inconsistent (some statements omit trailing semicolons)
- **Imports**: Mix of ES6 imports and CommonJS `require()`
- **Comments**: Minimal; code relies on structure for clarity
- **Naming**: camelCase for variables/functions; PascalCase for component names

---

## Tests and Their Commands

### Frontend Tests

**Test command**: `npm test` (runs Jest in watch mode)  
**Test file location**: `frontend/components/main/add/__tests__/Save.test.js`

**Test suite**: `Save.js - Character Count Feature`
- Validates that Save component defines a `charCount` style with specific properties (fontSize, color, textAlign)
- Checks that caption character count is rendered and visible
- Verifies caption state and `onChangeText` handler exist
- Confirms character count is right-aligned and styled as secondary text

**Run command**: `npm test` from `frontend/` directory

### Admin Tests

**Test command**: `npm test` (Create React App test runner)  
**Test file**: `admin/src/App.test.js`

No custom test implementation visible; file exists but contains only CRA boilerplate.

---

## Naming Conventions

### Components

- **PascalCase** for React component exports: `LoginScreen`, `FeedScreen`, `SaveScreen`, `ChatListScreen`, `ProfileScreen`, etc.
- Located in `frontend/components/` with subdirectories by feature (`auth/`, `main/post/`, `main/profile/`, etc.)
- Functional components with hooks (no class components observed)

### Files

- **PascalCase** for component files: `Login.js`, `Register.js`, `Main.js`, `Camera.js`, `Save.js`
- **camelCase** for utility/action files: `index.js` (reducers, actions, constants), `styles.js`, `utils.js`

### Variables and Functions

- **camelCase** for variables, state setters, and functions: `caption`, `setCaption`, `uploading`, `setUploading`, `downloadURL`, `fetchUser()`, `renderSuggestionsRow()`
- **Snake_case** avoided; no constants in SCREAMING_SNAKE_CASE (though Redux constants are uppercase: `USER_STATE_CHANGE`)

### Redux Artifacts

- **Action types** (constants): `USER_STATE_CHANGE`, `USERS_DATA_STATE_CHANGE`, `USER_POSTS_STATE_CHANGE` (SCREAMING_SNAKE_CASE in `frontend/redux/constants/index.js`)
- **Action creators**: camelCase functions returning dispatch-ready functions: `fetchUser()`, `fetchUserChats()`, `clearData()`
- **Reducers**: Named exports as `user`, `users` (lowercase) from `frontend/redux/reducers/user.js` and `frontend/redux/reducers/users.js`

### Styling

- **Shared style objects** exported from `frontend/components/styles.js`: `container`, `form`, `text`, `utils`, `navbar` (all camelCase)
- **Inline styles** in components often use camelCase object keys: `fontSize`, `backgroundColor`, `flexDirection`, `paddingTop`

---

## Project Structure

```
frontend/
├── App.js                          # Root component, navigation setup
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel transpiler config
├── package.json                    # Dependencies and scripts
├── components/
│   ├── auth/
│   │   ├── Login.js               # Email/password login
│   │   └── Register.js            # Registration screen
│   ├── Main.js                    # Tab navigation hub
│   ├── main/
│   │   ├── add/
│   │   │   ├── Camera.js          # Photo/video capture
│   │   │   ├── Save.js            # Caption + upload
│   │   │   └── __tests__/
│   │   │       └── Save.test.js   # Character count tests
│   │   ├── post/
│   │   │   ├── Feed.js            # Following feed
│   │   │   ├── Post.js            # Post detail + likes/comments
│   │   │   └── Comment.js         # Comment view
│   │   ├── profile/
│   │   │   ├── Profile.js         # User profile + edit
│   │   │   ├── Edit.js            # Profile editor
│   │   │   └── Search.js          # User search
│   │   ├── chat/
│   │   │   ├── Chat.js            # Conversation screen
│   │   │   └── List.js            # Chat list
│   │   └── random/
│   │       └── Blocked.js         # Banned user screen
│   ├── styles.js                  # Shared StyleSheet exports
│   └── utils.js                   # timeDifference() utility
├── redux/
│   ├── actions/
│   │   └── index.js               # fetchUser, fetchUserPosts, etc.
│   ├── constants/
│   │   └── index.js               # Redux action type constants
│   └── reducers/
│       ├── index.js               # Root reducer (combineReducers)
│       ├── user.js                # Current user state
│       └── users.js               # Other users' data
└── assets/                        # Images, icons

admin/
├── App.js                         # Root, router, auth
├── App.test.js                    # Placeholder test
├── package.json                   # CRA dependencies
├── src/
│   ├── App.js                     # (duplicate; likely overridden by outer App.js)
│   ├── components/
│   │   ├── Home.js                # Dashboard
│   │   ├── User.js                # Single user view
│   │   ├── Users.js               # Users list
│   │   ├── Post.js                # Post management
│   │   ├── Ride.js                # Feature management
│   │   └── login.js               # Admin login
│   ├── config/                    # Firebase config
│   └── index.js                   # Entry point
└── public/                        # Static assets

backend/
├── functions/
│   └── index.js                   # Cloud Functions exports
│       ├── addLike, removeLike
│       ├── addFollower, removeFollower
│       └── addComment

firestore_rules.txt                # Security rules
storage_rules.txt                  # Storage rules
```

---

## Key Code Organization Patterns

### Component Structure

Components are **functional** with **React Hooks** and **Redux** integration:

```javascript
// Example from frontend/components/main/add/Save.js
function Save(props) {
    const [caption, setCaption] = useState("")
    const [uploading, setUploading] = useState(false)
    
    useLayoutEffect(() => {
        props.navigation.setOptions({ ... })
    }, [caption])
    
    return (<View>...</View>)
}

const mapStateToProps = (store) => ({ currentUser: store.userState.currentUser })
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUserPosts, sendNotification }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Save)
```

### Shared Styles

Styles are centralized in `frontend/components/styles.js` and imported as objects:

```javascript
import { container, form, text, utils, navbar } from '../styles'
// Then used: <View style={[container.container, utils.padding15]}>
```

### Redux Async Actions

Actions use **Redux Thunk** for async operations:

```javascript
// frontend/redux/actions/index.js
export function fetchUser() {
    return ((dispatch) => {
        let listener = firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot, error) => {
                dispatch({ type: USER_STATE_CHANGE, currentUser: {...} })
            })
        unsubscribe.push(listener)
    })
}
```

### Firestore Listeners

Real-time subscriptions are managed in Redux actions; unsubscribe callbacks stored in an array to prevent memory leaks.

---

## Database Schema Consistency

**No explicit migrations or schema validation** found. Schema is defined implicitly by:
- Firestore security rules (enforce presence/type of fields for write permission in some cases)
- Frontend code assumptions about document structure
- Backend Cloud Functions expectations (e.g., `likesCount` field must exist for `increment()` to work)

**Recommended practice** (not observed): Add schema validation in Firestore security rules or backend functions.
