# Collaborative Whiteboard

Live demo: https://collaborative-whiteboard.vercel.app/

A realtime collaborative whiteboard application built with Next.js (frontend), Spring Boot (backend) and MongoDB (database). Multiple users can create or join a room, draw together on a shared canvas, and persist drawings to the database.

![Demo Image](https://github.com/costingh/collaborative-whiteboard/blob/master/demo.png?raw=true)

**Highlights**

- Realtime drawing synchronized between participants using WebSocket (STOMP over SockJS)
- Persistent rooms and drawings stored in MongoDB
- Simple REST API for room management and drawing persistence
- Next.js frontend with reusable components and responsive UI

**Features**

- Create / join rooms with a username
- Real-time broadcast of drawing coordinates and user join/leave events
- Save drawings to the database and retrieve previously saved drawings
- Basic drawing tools: pencil, eraser, thickness and color selection
- Export or import drawings

**Tech stack**

- Frontend: Next.js, React 17, Material-UI, SockJS / STOMP client
- Backend: Spring Boot (Java), Spring WebSocket (STOMP), MongoDB
- Database: MongoDB (official image used in docker-compose)

**Architecture (quick)**

- Frontend connects to the backend REST API at `http://localhost:8080` by default (configurable via `NEXT_PUBLIC_BACKEND_URL`).
- Realtime messaging uses a STOMP endpoint `/ws-message` (SockJS enabled). Messages are sent to application prefix `/app` and broadcasted by the broker on `/topic/*`.
- REST API base path: `/api/v1/rooms` (create room, fetch room(s), save drawings, retrieve drawings).

**Quick Start (development)**
Prerequisites:

- Java 11+ and Maven (or the included Maven Wrapper)
- Node.js 14+ and npm or yarn
- Docker & Docker Compose (optional, for running MongoDB locally)

1. Start MongoDB (optional, recommended for local development)

```powershell
cd server
docker-compose up -d
```

This starts `mongodb` (default 27017) and `mongo-express` (http://localhost:8081).

2. Run the backend

From the `server` folder you can use the Maven wrapper on Windows:

```powershell
cd server
.\mvnw.cmd spring-boot:run
```

Or with a local Maven installation:

```powershell
mvn -f server/pom.xml spring-boot:run
```

By default the backend listens on port `8080`.

3. Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

Set a custom backend URL for the frontend by exporting `NEXT_PUBLIC_BACKEND_URL`, for example:

```powershell
# Windows PowerShell
$env:NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8080'
npm run dev
```

**API Reference**
Base URL: `http://{HOST}:8080/api/v1/rooms`

- `POST /api/v1/rooms` — Create a new room. JSON body: `{ name, description, participants }`
- `GET /api/v1/rooms/all` — List all rooms
- `GET /api/v1/rooms/{id}` — Get room metadata
- `POST /api/v1/rooms/{roomId}/save-drawing` — Save a drawing to a room. Body contains drawing object
- `GET /api/v1/rooms/{roomId}/get-drawings` — Get saved drawings for a room

**WebSocket / STOMP (Realtime)**

- Endpoint (SockJS): `/ws-message` (registered in `WebSocketConfig`)
- STOMP application destination prefix: `/app`
- Broker destination prefix (simple broker): `/topic`

Message mappings (server handles these):

- `/app/send/{roomId}` → broadcast coordinates to `/topic/{roomId}`
- `/app/send/{roomId}/user` → handle user actions (CONNECT_USER / DISCONNECT_USER) and broadcast responses to `/topic/{roomId}/user`

Frontend notes:

- The frontend uses `frontend/utils/baseUrl.js` to set the backend base URL (reads `NEXT_PUBLIC_BACKEND_URL` or defaults to `http://localhost:8080`).
- Room creation and drawing save/retrieve utilities live under `frontend/utils` (e.g. `createRoom.js`, `saveDrawing.js`, `getDrawings.js`).

**Docker / Production**

- The `server/Dockerfile` can package the backend jar and run it in an OpenJDK 16 runtime image. Build the jar with `mvn -f server/pom.xml package` then build the image:

```powershell
cd server
mvn package
docker build -t collaborative-whiteboard:server .
docker run -p 8080:8080 collaborative-whiteboard:server
```

Note: `server/docker-compose.yaml` only starts MongoDB and mongo-express. You can adapt it to run the backend and frontend containers if desired.

**Developer tips**

- Default backend port: `8080` — change via Spring Boot properties in `server/src/main/resources/application.properties`.
- Default MongoDB credentials in `server/docker-compose.yaml` are placeholder values — update for production.
- The STOMP/SockJS config is in `server/src/main/java/com/project/whiteboard/config/WebSocketConfig.java`.

**Contributing**

- Fork the repo, create a branch, make changes, and open a pull request. Run both frontend and backend locally when adding features related to realtime behavior.

**License & Acknowledgements**

- Original author: Costin Gh. (see upstream repo)
- This project uses open-source libraries: Next.js, React, Spring Boot, MongoDB.

If you'd like, I can also update the `frontend/README.md` or add a short CONTRIBUTING.md.
