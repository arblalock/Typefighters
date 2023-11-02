## Type fighters

(\***\*Work in progress\*\***)

Web app I am developing where two players compete to see who is the faster typist!

### Tech Stack

(Work in progress)

- **Client/Server Web App:** NextJS
- **Game Server:** SocketIO

Tech Stack consists of two main components:

- A NextJS web app for handling the game appliction code
- A SocketIO server that handles the real-time events needed for the game

A seperate SocketIO server is used to improve future scalability/performance by seperating real-time client
websocket requests from the normal client-side requests handled by NextJS. This will allow each to be run on different containers/servers/etc...

## Run Localy

Run Web App:

```bash
cd ./app
npm run dev
# or
yarn dev
```

Run Game Server:

```bash
cd ./server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).
