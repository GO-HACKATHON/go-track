# Go-Track API

This is the API server for go-track. The server is responsible for:

- Retrieving location updates of the BLE devices
- Performing some sort of calculation to determine approximate location of a certain BLE device by combining multiple location data

## Running

This server runs on Node (tested on Node 6.7.0, but should work on Node >= 4). Get Node from (https://nodejs.org/en/)[https://nodejs.org/en/].

**Running the server**

```bash
$ npm install
$ npm start
```

Go-Track API will run on port 8000 by default. Override the `server.port` on `config.js` to change the port. 

**Running development mode:**

We use (nodemon)[https://www.npmjs.com/package/nodemon] to automatically watch changes in code and restart the server.

```bash
$ npm install -g nodemon
$ npm install
$ nodemon server.js
```

## Endpoints

TODO