## Go Track Library

Library for calculating [Multilateration](https://en.wikipedia.org/wiki/Multilateration) in order to determine beacons' location from several GPS locations.

### Example

```js
{ multilateration } = require('./lib');

const locations = [{
    accuracy: 38.68017481817407, // accuracy is how far the beacon is detected, in meters
    latitude: -6.243813,
    longitude: 106.804033
}, {
    accuracy: 27.9367987392963,
    latitude: -6.243813,
    longitude: 106.804033
}, {
    accuracy: 58.56856707103607,
    latitude: -6.243813,
    longitude: 106.804033
}];

const estimatedLocation = multilateration(locations); // { accuracy, latitude, longitude }
```
