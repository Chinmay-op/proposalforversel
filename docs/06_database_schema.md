# 🗄️ Firebase Firestore & Local Storage Schema

This guide outlines the data persistence topology of the **AI Proposal Generator**. The platform implements a **hybrid storage model**: syncing to **Google Cloud Firestore** when users are authenticated, and persisting state in a local **IndexedDB object store** during offline operations.

---

## 1. The 1 MB Document Limit Mitigation Strategy

Google Cloud Firestore enforces a strict limit of **1 MB** of data per document. In rich documents containing multiple version arrays, full CoT thoughts, and component schemas, standard document maps can easily exceed this limit.

To guarantee scaling performance and prevent size-limit crashes, the storage system splits sessions into two distinct entities:

```
                          ┌──────────────────────────┐
                          │    users/{uid}/          │
                          └─────┬──────────────┬─────┘
                                │              │
     (LIGHTWEIGHT LISTING)      │              │ (HEAVY PAYLOAD SERIALIZED)
                                ▼              ▼
        ┌───────────────────────────┐      ┌───────────────────────────┐
        │  sessions/{sessionId}     │      │  sessionData/{sessionId}  │
        │                           │      │                           │
        │ - id: string              │      │ - id: string              │
        │ - title: string           │      │ - updatedAt: timestamp    │
        │ - updatedAt: timestamp    │      │ - documentJson: string    │
        │ - pageCount: number       │      │ - planJson: string        │
        │ - activeThemeName: string │      │ - themeJson: string       │
        └───────────────────────────┘      │ - documentVersionsJson: " │
                                           │ - activeVersionIndex: int │
                                           └───────────────────────────┘
```

- **Metadata document** (`users/{uid}/sessions/{sessionId}`): Contains only small strings and timestamps. Allows the frontend to load and render history lists instantly without fetching heavy proposal content.
- **Heavy Data document** (`users/{uid}/sessionData/{sessionId}`): Sub-arrays (e.g. historical versions, layout plans, prompts, raw text) are stringified (packed) using `JSON.stringify()` and saved in flat text fields. The frontend unpacked (`JSON.parse()`) them on request.

---

## 2. Firestore Document Schemas

### A. User Profile Collection
- **Path**: `/users/{userId}`
- **Purpose**: Defines authenticated users and their operational authority levels (e.g. access to `/components/admin/AdminPanel.jsx`).

```json
{
  "email": "string (e.g. user@gritsama.com)",
  "isAdmin": "boolean (defines back-office system privileges)",
  "createdAt": "timestamp"
}
```

---

### B. Lightweight Sessions Metadata Collection
- **Path**: `/users/{userId}/sessions/{sessionId}`
- **Purpose**: Fast query indexes for historical lists in the UI Sidebar.

```json
{
  "id": "string (UUID v4 session key)",
  "title": "string (e.g. Mining IoT Safety)",
  "updatedAt": "number (Epoch millisecond timestamp)",
  "pageCount": "number (Total generated page array length)",
  "activeThemeName": "string (Active CSS palette selection)"
}
```

---

### C. Large-Payload Session Data Collection
- **Path**: `/users/{userId}/sessionData/{sessionId}`
- **Purpose**: Contains the complete serialized content of the proposals.

```json
{
  "id": "string (UUID v4 session key)",
  "title": "string",
  "updatedAt": "number (Epoch milliseconds)",
  "activeThemeName": "string",
  "activeVersionIndex": "number (Currently selected history version index)",
  "documentJson": "string (Stringified React page/component props array)",
  "planJson": "string (Stringified Phase 1 blueprint outline)",
  "themeJson": "string (Stringified custom calculated dynamic theme)",
  "conversationHistoryJson": "string (Stringified refining chat text strings)",
  "documentVersionsJson": "string (Stringified array of past versions, allowing v1 -> v2 restores)"
}
```

---

## 3. Query Indexing & Client Sorting

To eliminate database operational overhead, the platform avoids complex composite Firestore indexes:
- The system pulls the entire array of user session metadata.
- **Client-Side Sorting**: Sorting is handled on the client using the `updatedAt` key descending:
  ```javascript
  sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  ```
This guarantees instant updates and keeps resource usage inside free Firestore limits.

---

## 4. Firestore Security Rules Definition

Access bounds are defined inside `firestore.rules` at the root of the workspace. The configuration enforces user scoping:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile doc. Admins have global master access.
    match /users/{userId} {
      allow read: if request.auth != null && (
        request.auth.uid == userId ||
        isAdmin(request.auth.uid)
      );
      allow write: if request.auth != null && (
        request.auth.uid == userId ||
        isAdmin(request.auth.uid)
      );
    }

    // Authenticated users can only read/write their own lightweight sessions lists.
    match /users/{userId}/sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Authenticated users can only read/write their own heavy payloads.
    match /users/{userId}/sessionData/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Global Admin Authorization helper function
    function isAdmin(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.isAdmin == true;
    }
  }
}
```

---

## 5. Offline & Sandbox Local Database (IndexedDB)

For local development or when users are running offline, the platform falls back to browser-side IndexedDB storage scoped in `src/utils/idbStorage.js`:

- **Database Identifier**: `ProposalGeneratorDB`
- **Active Schema Version**: `1`
- **Target Storage Namespace**: `sessions` (Object Store)
- **Key Path Routing**: `id` (maps directly to the Session UUID)
- **Data Payload Layout**: Stores the raw combined JSON document (no splitting/packing required, as IndexedDB does not enforce the 1 MB document limit).
- **Core Operations**:
  - `saveSession(sessionData)`: Writes or updates the session details.
  - `getAllSessions()`: Returns the local history.
  - `getSession(id)`: Fetches a single session.
  - `deleteSession(id)`: Deletes a session.
