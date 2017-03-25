import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Trackees } from '../../providers/providers';
import { AlertController } from 'ionic-angular';

declare var google;

@Component({
  templateUrl: 'trackee-add.html',
})
export class TrackeeAddPage {
  id: string;
  name: string;
  type: string;
  nearMeNotifSetting: string;
  showMap: Boolean = true;
  firstIdHit: Boolean = false;
  @ViewChild('map') map;
  constructor(private nav: NavController, private ble: BLE, private trackees: Trackees, public alert: AlertController) {}

  initJSMaps(mapEle) {
    let map = new google.maps.Map(mapEle, {
      center: { lat: -6.2416331, lng: 106.7945741 },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    map.setOptions({ minZoom: 11, maxZoom: 20 });

    var bounds = {
      north: -6.2416331 + 0.005,
      south: -6.2416331 - 0.005,
      east: 106.7945741 + 0.005,
      west: 106.7945741 - 0.005
    };

    // Define a rectangle and set its editable property to true.
    var rectangle = new google.maps.Rectangle({
      bounds: bounds,
      editable: true
    });
    rectangle.setMap(map);
  }

  ionViewDidLoad() {
    let mapEle = this.map.nativeElement;

    if (!mapEle) {
      console.error('Unable to initialize map, no map element with #map view reference.');
      return;
    }

    // Disable this switch if you'd like to only use JS maps, as the APIs
    // are slightly different between the two. However, this makes it easy
    // to use native maps while running in Cordova, and JS maps on the web.
    // if (this.platform.is('cordova') === true) {
    //   this.initNativeMaps(mapEle);
    // } else {
    //   this.initJSMaps(mapEle);
    // }
    this.initJSMaps(mapEle);
  }

  scanBLE() {
    this.firstIdHit = true;
    const onDeviceFound = (device) => {
      if (this.firstIdHit) {
        this.id = device.id
      }
    }
    const onError = (err) => {
      console.log('Error while scanning:', err);
    }
    this.ble.startScan([]).subscribe(onDeviceFound, onError);
  }

  saveTrackee() {
    const payload = {
      boundingBoxNotifSetting: {
        enabled: false,
        // enabled: true,
        // northeast: {
        //   latitude: -6.240446,
        //   longitude: 106.790652
        // },
        // southwest: {
        //   latitude: -6.241364,
        //   longitude: 106.791425
        // }
      },
      category: this.type,
      id: this.id,
      name: this.name,
      nearMeNotifSetting: parseInt(this.nearMeNotifSetting || "0")
    };
    this.trackees.existById(this.id, (res) => {
      if (res) {
        let alert = this.alert.create({
          title: 'Already registered!',
          subTitle: 'Your scanned device already registered!',
          buttons: ['OK']
        });
        alert.present();
      } else {
        this.trackees.store(payload, () => {
           this.nav.pop();
        });
      }
    });
  }
}
