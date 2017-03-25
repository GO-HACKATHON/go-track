import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Bluetooth } from '../../providers/providers';

@Component({
  templateUrl: 'sense.html',
})
export class SensePage {

  scanning = false;
  distances = [];
  nRollingAverage = 5;
  humanizedDistance = 'Device is not rearby';
  id = 'D1:F5:CA:7F:3B:1F';

  constructor(private nav: NavController, private bluetooth: Bluetooth, private ref: ChangeDetectorRef) {
    this.startScan(); // TODO: do not hardcode ID
  }

  startScan() {
    console.log(`[SENSE][${this.id}] Start scanning`);
    this.scanning = true;
    const self = this;
    this.bluetooth.scanIndefinitely((device) => {
      if (device.id === self.id) {
        self.updateDistance(device.distance);
        console.log(`[SENSE][${self.id}] Updating distance: ${device.distance}`);
      }
    });
  }

  updateDistance(distance) {
    this.distances.push(distance);
    while (this.distances.length > this.nRollingAverage) {
      this.distances = this.distances.slice(1, this.distances.length);
    }
    let total = 0, i;
    for (i = 0; i < this.distances.length; ++i) {
      total += this.distances[i];
    }

    let calculatedDistance;
    if (this.distances.length > 2) {
      total -= Math.min.apply(null, this.distances) + Math.min.apply(null, this.distances);
      calculatedDistance = total / (this.distances.length - 2);
    } else {
      calculatedDistance = total / this.distances.length;
    }
    this.humanizedDistance = `${Number((calculatedDistance).toFixed(2))} meter`;
    this.ref.detectChanges();
  }

  stopScan() {
    console.log(`[SENSE][${this.id}] Stop scanning`);
    this.scanning = false;
    this.bluetooth.stopScan();
  }
}
