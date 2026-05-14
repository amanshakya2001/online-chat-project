# Online Chat

A real-time one-to-one chat application with Google Sign-In, live online presence, in-app notifications, and integrated peer-to-peer video calling — built with a Node.js/Socket.io backend and a React frontend.

## Features

- Google OAuth sign-in via Firebase Authentication (Google popup)
- Real-time one-to-one messaging between any two online users using Socket.io
- Live online presence list — users appear and disappear as they connect or disconnect
- Per-conversation unread message badge with browser Notification API alert and audio chime
- Peer-to-peer video calling using WebRTC (via simple-peer): initiate a call from the chat list, receive an incoming call notification, accept or end the call
- Emoji picker (emoji-picker-react) in the chat input
- Persistent user profiles (name, email, Google avatar) stored in PostgreSQL
- Socket.io Admin UI integration on the backend for live connection monitoring

## Tech Stack

**Backend (`chat-backend/`)**
- Node.js / Express
- Socket.io 4
- PostgreSQL (`pg`) — stores user profiles, online status, and active socket IDs
- moment-timezone (message timestamps)
- @socket.io/admin-ui

**Frontend (`chat-frontend/`)**
- React 18 (Create React App)
- Socket.io-client
- Firebase Authentication (Google provider)
- simple-peer (WebRTC peer-to-peer wrapper)
- React Router v6
- Bootstrap 5 / Sass
- emoji-picker-react

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database
- A Firebase project with Google Authentication enabled

### Installation

```bash
git clone https://github.com/amanshakya2001/online-chat-project.git
cd online-chat-project
```

**Backend**

```bash
cd chat-backend
npm install
```

Update the PostgreSQL `connectionString` in `index.js` (or extract it to `.env`).

**Frontend**

```bash
cd chat-frontend
npm install
```

Create `chat-frontend/.env`:

```env
REACT_APP_SOCKET_URL=http://localhost:8080
```

Add your Firebase project config to `src/firebase.js`.

### Running

Start the backend (port 8080):

```bash
cd chat-backend
npm start
```

Start the frontend (port 3000) in a separate terminal:

```bash
cd chat-frontend
npm start
```

## Project Structure

```
online-chat-project/
  chat-backend/
    index.js          # Express + Socket.io server — all socket event handlers
                      # (login, messaging, presence, WebRTC signalling)
    package.json
  chat-frontend/
    src/
      App.jsx           # Root: Firebase auth, socket setup, WebRTC call logic
      firebase.js       # Firebase app and auth initialisation
      components/
        chat/           # Contact list, message thread, notification badges
        login/          # Google Sign-In page
        video/          # Video call UI (incoming call screen, video feeds)
```

## License

MIT
