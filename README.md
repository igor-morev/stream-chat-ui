# 💬 Real-Time Chat & Video Meeting Engine

A comprehensive real-time communication platform combining instant messaging and high-quality video conferencing. Built with **Angular 20** and **NestJS** utilizing **Native WebSockets**.

## 🚀 Key Features

- **Instant Messaging**: Real-time text exchange, typing indicators (`typing`), and user presence tracking (`presence`).
- **Video Meetings (WebRTC)**: Group and P2P calls using Mesh architecture (direct peer-to-peer connection).
- **Native WebSockets**: Built on pure `ws` protocol without heavy abstractions (like Socket.io), ensuring maximum performance and low latency.
- **F5-Resilience**: Meeting states are persisted on the server. Sessions are automatically restored upon page refresh or reconnection.
- **Catch-up Notifications**: Users instantly receive invitations to ongoing meetings upon logging into the application.

## 📡 Socket Events Protocol

The system uses a single communication channel for all event types. Message format: `{ "event": "event_name", "data": { ... } }`.

### 📝 Chat & Presence


| Event | Description |
| :--- | :--- |
| `message` | Sending and receiving new text messages. |
| `typing` | Notification that the interlocutor is typing. |
| `presence` | User online/offline status updates. |

### 🎥 Video Meetings (WebRTC)


| Event | Description |
| :--- | :--- |
| `start_meeting` | Initiates a new meeting session. |
| `meeting_invitation` | Broadcasts invitations (statuses: `active`/`inactive`). |
| `join_meeting` | Signal from a participant ready to establish a connection. |
| `video-signal` | Relay for WebRTC signals (Offer, Answer, ICE Candidates). |
| `meeting_user_joined` | Notifies the host that a participant has entered the room. |
| `meeting_user_left` | Notifies about a participant leaving or connection loss. |
| `leave_meeting` | Manual exit from the current call. |
| `stop_meeting` | (Host only) Terminates the meeting and revokes invitations. |
| `meeting_ended` | Signal to all participants that the room is closed. |
| `get_room_info` | Requests the current room state upon page initialization. |
| `room_info_response` | Server response with meeting data and online participants list. |

## 🛠 Tech Stack

- **Frontend**: Angular 20 (Signals, DestroyRef, Standalone Components).
- **Backend**: NestJS, **Native WebSockets** (`@nestjs/platform-ws`).
- **Protocol**: WebRTC (Signaling via native sockets).

## 💻 Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run start
```

## 🗺 Roadmap

- [ ] **Redis Integration**: Move active meeting storage to Redis for horizontal scaling and high availability.
- [ ] **Smart Cleanup**: Implement an auto-termination timer if no active participants remain in the call.
- [ ] **Screen Sharing**: Enable screen broadcasting using the `getDisplayMedia` API.
- [ ] **Reconnection Grace Period**: Implement a short timeout for host disconnections to prevent instant call termination during network flickers.

## ⚠️ Technical Notes

- **Resource Cleanup**: When a call ends, the `closeAllConnections()` method stops all `MediaStreamTracks` and closes `RTCPeerConnection` ports.
- **Local Stream**: The local video preview is always `muted` to prevent acoustic feedback loops (echo).
- **Browser Support**: Optimized for **Chromium** and **Firefox**. Safari support is currently experimental/unsupported.