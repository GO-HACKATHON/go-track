import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google;

@Component({
  templateUrl: 'trackee-add.html',
})
export class TrackeeAddPage {

  showMap: Boolean = true;
  @ViewChild('map') map;
  constructor(private nav: NavController) {}

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

  saveTrackee() {
	  this.nav.pop();
  }
}
