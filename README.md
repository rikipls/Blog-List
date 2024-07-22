# Blog List

A personal collection of links to other webpages using React, Express, and MongoDB. Written in Typescript and running on Node.js.

## Running the app

In each directory, run `npm install` to  install the needed packages

### Backend

To start the server and connect to a MongoDB instance, you'll need to define some environment variables in a `.env` file.

E.g. something like

```txt
MONGODB_URI=<Your main database URI here>
PORT=<Your port number here; used for the express server>
SECRET=<any string here; used for verifying json webtokens>

TEST_MONGODB_URI=<Your test database URI here; only used when running tests>
```

> Note: see [here](https://mongoosejs.com/docs/connections.html) for more details on connecting using [mongoose](https://mongoosejs.com/).

Then run `npm run release` to compile the Typescript and start the server.

To run any of the api integration tests in `server/src/tests`, the `TEST_MONGODB_URI` variable must be defined and valid. To run *all* tests, use `npm run test`.

### Frontend

Run `npm run dev` to start the Vite project.
