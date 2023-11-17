## Type fighters

\***\*Work in progress\*\***

Web app I am developing where two players compete to see who is the faster typist!

### Tech Stack

- **Client/Server Web App:** NextJS
- **Game Server:** SocketIO
- **Database:** Redis

Tech Stack consists of three main components:

- A NextJS web app for handling the game appliction code
- A SocketIO server that handles the real-time events needed for the game
- A Redis server to store match info

A seperate SocketIO server is used to improve future scalability/performance by seperating real-time client
websocket requests from the normal client-side requests handled by NextJS. This will allow each to be run on different containers/servers/etc...

## Run Localy

First, in your development environment set any needed evironment variables to ones you'd like to use. For example the socketIO port vars (SOCKETIO_PORT, NEXT_PUBLIC_SOCKETIO_PORT) can be set to 8080.

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

Start a Redis server:

Install guide for Redis on Linux: [Install Guide](https://redis.io/docs/install/install-redis/install-redis-on-linux/)

```bash
sudo service redis-server start
```

Open [http://localhost:3000](http://localhost:3000).
