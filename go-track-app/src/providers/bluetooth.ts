import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';

@Injectable()
export class Bluetooth {

  private rssiConstant = -65;
  private rssiFactor = -2.657542;

  constructor(private ble: BLE) {}

  scan(seconds, callback) {
    const onDeviceFound = (device) => {
      console.log('Device found:', device);
      callback({
        id: device.id,
        distance: this.convertRSSIToDistance(device.rssi)
      });
    };
    const onError = (err) => {
      console.log('Error while scanning:', err);
    }

    console.log('start scanning ...');
    return this.ble.scan([], seconds).subscribe(onDeviceFound, onError);
  }

  scanIndefinitely(callback, reportDuplicates = true) {
    const onDeviceFound = (device) => {
      console.log('Device found:', device);
      callback({
        id: device.id,
        distance: this.convertRSSIToDistance(device.rssi)
      });
    };
    const onError = (err) => {
      console.log('Error while scanning:', err);
    }

    this.ble.startScanWithOptions([], { reportDuplicates }).subscribe(onDeviceFound, onError);
  }

  stopScan() {
    this.ble.stopScan();
  }

  convertRSSIToDistance(rssi) {
    return Math.pow(10, (rssi - this.rssiConstant) / (10 * this.rssiFactor));
  }
}
