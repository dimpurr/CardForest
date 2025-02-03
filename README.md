# CardForest

CardForest is a modern knowledge management application that helps you organize and connect your thoughts, notes, and ideas.

## Features

- Rich text editing with TipTap
- Visual relationship mapping with React Flow
- Customizable card models
- Dark mode support
- Cross-platform support (Web & Desktop)

## Tech Stack

- **Frontend**:
  - Next.js (React)
  - Radix UI (Accessible UI components)
  - Tailwind CSS (Styling)
  - Jotai (State management)
  - TipTap (Rich text editor)
  - React Flow (Relationship visualization)
  - Auth.js (Authentication)
  - Apollo Client (GraphQL client)

- **Backend**:
  - Node.js
  - GraphQL
  - MongoDB
  - TypeScript
  - NestJS (API framework)

## Initial Setup

Install the required tools:

- Node.js
- Homebrew
- Yarn
  Manage Node versions using n.

To install dependencies, run the following in the project root directory:

```bash
yarn
```

## How to Run

### Documentation (docs)

Navigate to the docs directory and start the development server:

```bash
cd cardforest/packages/docs
NODE_OPTIONS=--openssl-legacy-provider npm run dev
```

Access the documentation at: http://localhost:3000/docs

Modify the navigation by editing `cardforest/packages/docs/src/.vuepress/config.js` .

### Server (server)

Navigate to the server directory, generate typings, and start the development server:

```bash
cd cardforest/packages/server
ts-node scripts/generate-typings.ts
yarn start:dev
```

Access the server at: http://127.0.0.1:3030/

### ArangoDB

Start ArangoDB with the provided script and follow the logs:

```bash
sh scripts/start-arangodb.sh
docker logs arangodb-instance
```

Connect to the ArangoDB shell:

```bash
docker exec -it arangodb-instance arangosh --server.endpoint tcp://127.0.0.1:8529 --server.database _system
```

List all databases and switch to the cardforest database:

```javascript
db._databases();
db._useDatabase("cardforest");
```

List collections and query cards and users:

```javascript
db._collections();

var cardsQuery = `FOR card IN cards RETURN card`;
var cardsResult = db._query(cardsQuery).toArray();
console.log(cardsResult);

var usersQuery = `FOR user IN users RETURN user`;
var usersResult = db._query(usersQuery).toArray();
console.log(usersResult);
```

### ArangoDB Docker

To use ArangoDB with Docker, you can use the following commands:

```bash
# Pull the ArangoDB Docker image
docker pull arangodb/arangodb:latest

# Run ArangoDB in a Docker container
docker run -d --name arangodb-instance -p 8529:8529 -v ~/arangodb:/var/lib/arangodb arangodb/arangodb:latest

# Stop the ArangoDB container
docker stop arangodb-instance

# Remove the ArangoDB container
docker rm arangodb-instance
```

Note: You can also use the `make db` command to start ArangoDB in a Docker container, as described in the `How to Run` section.

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

## Architecture

CardForest is designed with a modular architecture that supports multiple deployment modes:
- Web application (Next.js)
- Desktop application (Electron)
- Universal/Isomorphic core logic

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
