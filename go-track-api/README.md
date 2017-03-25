# Go-Track API

This is the API server for go-track. The server is responsible for:

- Retrieving location updates of the BLE devices
- Performing some sort of calculation to determine approximate location of a certain BLE device by combining multiple location data

## Setup

### Config

Create `config.js` file. The structure is provided in `example.config.js`.

### Papertrail

We use [Papertrail](https://papertrailapp.com) for logging. Provide the `host` and `port` parameters inside `papertrail` attribute in config. This is optional; if `papertrail` attribute is not provided then the server will still log to standard output. 

### Firebase

We use [Firebase](https://firebase.google.com/) as realtime database. Create new project and create a service account key.

- Provide database url in config as attribute `firebase.databaseUrl`.
- Save the service account key as `secrets/firebase.json`. To make sure you get the correct file, the file has the following structure:

```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

## Running

This server runs on Node (tested on Node 6.7.0, but should work on Node >= 4). Get Node from [https://nodejs.org/en/](https://nodejs.org/en/).

**Running the server**


```bash
$ npm install
$ npm start
```

Go-Track API will run on port 8000 by default. Override the `server.port` on `config.js` to change the port. 

**Running development mode:**

We use [nodemon](https://www.npmjs.com/package/nodemon) to automatically watch changes in code and restart the server.

```bash
$ npm install -g nodemon
$ npm install
$ nodemon server.js
```

## Endpoints

TODO