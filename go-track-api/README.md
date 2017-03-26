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

### Send Location Updates

```json
POST /location

{
  "location": {
    "latitude": -6.9190999,
    "longitude": 107.5974217,
    "accuracy": 25
  },
  "devices": [{
    "id": "device_id_1",
    "distance": 1.4
  }, {
  	"id": "device_id_2",
  	"distance": 3.8
  }]
}
```

Distance and accuracy are in meters.

### Get Devices Location

```
GET /locationById/:id?n=1
```

`n` is the maximum number of locations to fetch. If not provided, then the default value `n = 1` will be used.

Response:

```json
{
  "lastKnownLocations": [{
    "timestamp": 1490302121149,
    "location": {
        "latitude": -6.9190999,
        "longitude": 107.5974217,
        "accuracy": 26.4
    },
  }]
}
```

### Store/Update Trackee

```json
POST /trackee

{
  "id": "...", 
  "name": "...",
  "category": "...",
  "nearMeNotifSetting": 100,
  "boundingBoxNotifSetting": {
    "enabled": true,
    "northeast": {
      "latitude": -6.9190999,
      "longitude": 107.5974217,
    },
    "southwest": {
      "latitude": -6.9190999,
      "longitude": 107.5974217,
    }
  }
}
```

### Get Trackees List

```
GET /trackee
```

Response:

```json
[{
  "id": "...", 
  "name": "...",
  "category": "...",
  "nearMeNotifSetting": 100,
  "boundingBoxNotifSetting": {
    "enabled": true,
    "northeast": {
      "latitude": -6.9190999,
      "longitude": 107.5974217,
    },
    "southwest": {
      "latitude": -6.9190999,
      "longitude": 107.5974217,
    }
  }
}]
```

### Get Trackee By Id

```
GET /trackeeById/:trackeeId
```

Response:

```json
{
  "id": "...", 
  "name": "...",
  "category": "...",
  "nearMeNotifSetting": 100,
  "boundingBoxNotifSetting": {
    "enabled": true,
    "northeast": {
      "latitude": -6.9190999,
      "longitude": 107.5974217,
    },
    "southwest": {
      "latitude": -6.9190999,
      "longitude": 107.5974217,
    }
  }
}
```

This will return 404 if no trackee with such id found.
