import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ViewController, AlertController } from 'ionic-angular';
import { GoogleMap, GoogleMapsLatLng } from 'ionic-native';
import { TrackeeAddPage } from '../trackee-add/trackee-add';
import { SensePage } from '../sense/sense';
import { NotificationHistoryPage } from '../notification-history/notification-history';

declare var google;

@Component({
  templateUrl: 'trackee-detail.html',
})
export class TrackeeDetailPage {
  @ViewChild('map') map;

  constructor(public nav: NavController, public platform: Platform, public alert: AlertController) {}

  initJSMaps(mapEle) {
    let map = new google.maps.Map(mapEle, {
      center: { lat: -6.2416331, lng: 106.7945741 },
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    map.setOptions({ minZoom: 11, maxZoom: 20 });
  }

  initNativeMaps(mapEle) {
    this.map = new GoogleMap(mapEle);
    mapEle.classList.add('show-map');

    GoogleMap.isAvailable().then(() => {
      const position = new GoogleMapsLatLng(43.074395, -89.381056);
      this.map.setPosition(position);
    });
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

  goToEdit() {
    this.nav.push(TrackeeAddPage);
  }

  goToSense() {
    this.nav.push(SensePage);
  }

  goToNotificationHistory() {
    this.nav.push(NotificationHistoryPage);
  }

  handleDelete() {
    let confirm = this.alert.create({
      title: 'Delete confirmation',
      message: 'Are you sure you want to delete this device?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.nav.pop();
          }
        }
      ]
    });
    confirm.present();
  }
}
