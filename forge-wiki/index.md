# Instagram Clone

A cross-platform Instagram clone application built with React Native and Firebase, featuring a mobile app (frontend), a web admin panel (admin), and cloud functions backend.

## Application Overview

InstagramClone is a full-stack social media application that replicates core Instagram features:

- **User authentication** via Firebase Authentication (email/password)
- **Photo and video posting** with caption support
- **Social features**: following, likes, comments, user mentions (@username tagging)
- **Real-time messaging** between users
- **User search and discovery**
- **Admin panel** for system management

The application is built with a clear separation between three main components:

1. **Frontend** - React Native mobile app (iOS/Android via Expo)
2. **Admin** - React web application for administrative operations
3. **Backend** - Node.js Firebase Cloud Functions for server-side logic

---

## Core Documentation

- [Architecture Decisions](architecture-decisions.md) — Components, data storage, hosting, and notable libraries with rationale
- [Coding Standards](coding-standards.md) — Languages, tooling, formatting, testing, naming conventions, and project structure
- [Known Issues](known-issues.md) — TODO/FIXME notes, test status, and documented limits

---

## Feature Pages

- [Frontend: Add/Save Feature](frontend-add-save.md) — Post creation and upload flow with caption input and @mentions

---

## Deployment Files

Security rules are defined in:

- `firestore_rules.txt` — Firestore access control
- `storage_rules.txt` — Cloud Storage access control

---

**License:** Apache License 2.0
