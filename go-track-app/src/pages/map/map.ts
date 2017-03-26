import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';

import { GoogleMap, GoogleMapsLatLng } from 'ionic-native';
import { PopoverController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { TrackeeAddPage } from '../trackee-add/trackee-add';
import { TrackeeListPage } from '../trackee-list/trackee-list';
import { TrackeeDetailPage } from '../trackee-detail/trackee-detail';
import { SettingsPage } from '../settings/settings';
import { Trackees, Bluetooth } from '../../providers/providers';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import moment from 'moment';

declare var google;

function TxtOverlay(pos, txt, cls, map, callback) {

    // Now initialize all properties.
    this.pos = pos;
    this.txt_ = txt;
    this.cls_ = cls;
    this.map_ = map;
    this.callback = callback;

    // We define a property to hold the image's
    // div. We'll actually create this div
    // upon receipt of the add() method so we'll
    // leave it null for now.
    this.div_ = null;

    // Explicitly call setMap() on this overlay
  this.setMap(map);
}

TxtOverlay.prototype = new google.maps.OverlayView();



TxtOverlay.prototype.onAdd = function() {

  // Note: an overlay's receipt of onAdd() indicates that
  // the map's panes are now available for attaching
  // the overlay to the map via the DOM.

  // Create the DIV and set some basic attributes.
  var div = document.createElement('DIV');
  div.className = this.cls_;

  div.innerHTML = this.txt_;

  // Set the overlay's div_ property to this DIV
  this.div_ = div;
  var overlayProjection = this.getProjection();
  var position = overlayProjection.fromLatLngToDivPixel(this.pos);
  div.style.left = position.x + 'px';
  div.style.top = position.y + 'px';
  div.style.position = 'absolute';
  // We add an overlay to a map via one of the map's panes.

  var panes = this.getPanes();
  panes.floatPane.appendChild(div);
  var that = this;

  google.maps.event.addDomListener( div, 'click', function(){
      google.maps.event.trigger(that, 'click'); // from [http://stackoverflow.com/questions/3361823/make-custom-overlay-clickable-google-maps-api-v3]
      that.callback();
  });
}
TxtOverlay.prototype.draw = function() {


    var overlayProjection = this.getProjection();

    // Retrieve the southwest and northeast coordinates of this overlay
    // in latlngs and convert them to pixels coordinates.
    // We'll use these coordinates to resize the DIV.
    var position = overlayProjection.fromLatLngToDivPixel(this.pos);


    var div = this.div_;
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';



  }
  //Optional: helper methods for removing and toggling the text overlay.  
TxtOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
}

TxtOverlay.prototype.setPosition = function(pos) {
  this.pos = pos;
  var overlayProjection = this.getProjection();
  var position = overlayProjection.fromLatLngToDivPixel(this.pos);
  if (this.div_) this.div_.style.left = position.x + 'px';
  if (this.div_) this.div_.style.top = position.y + 'px';
  if (this.div_) this.div_.style.position = 'absolute';
}

TxtOverlay.prototype.hide = function() {
  if (this.div_) {
    this.div_.style.visibility = "hidden";
  }
}

TxtOverlay.prototype.show = function() {
  if (this.div_) {
    this.div_.style.visibility = "visible";
  }
}

TxtOverlay.prototype.toggle = function() {
  if (this.div_) {
    if (this.div_.style.visibility == "hidden") {
      this.show();
    } else {
      this.hide();
    }
  }
}

TxtOverlay.prototype.toggleDOM = function() {
  if (this.getMap()) {
    this.setMap(null);
  } else {
    this.setMap(this.map_);
  }
}

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="goToAddTrackee()">Add Trackee</button>
      <button ion-item (click)="goToListTrackee()">List Trackee</button>
      <button ion-item (click)="goToSetting()">Setting</button>
    </ion-list>
  `
})
export class PopoverPage {
  bluetooth: any;

  constructor(public viewCtrl: ViewController, private nav: NavController, private navParams: NavParams) {
    this.bluetooth = navParams.get('bluetooth');
  }

  close() {
    this.viewCtrl.dismiss();
  }
  goToAddTrackee() {
    this.viewCtrl.dismiss();
	  this.bluetooth.stopScan();
    this.nav.push(TrackeeAddPage);
  }
  goToListTrackee() {
    this.viewCtrl.dismiss();
	  this.bluetooth.stopScan();
    this.nav.push(TrackeeListPage);
  }
  goToSetting() {
    this.viewCtrl.dismiss();
	  this.bluetooth.stopScan();
    this.bluetooth.stopScan();
    this.nav.push(SettingsPage);
  }
}


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  trackeesList: any;
  gmap: any;
  mypos: any;
  appliedFilter: string = "all";
  @ViewChild('map') map;
  flag: any;
  devices = [];
  lastKnownLocation;

  constructor(
      public nav: NavController, 
      public platform: Platform,
      public popoverCtrl: PopoverController,
      private trackees: Trackees, 
      private geolocation: Geolocation,
      private navParams: NavParams,
      private bluetooth: Bluetooth,
      private http: Http) {
    this.flag = navParams.get('flag'); 
    console.log('flag = ', this.flag);
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, { bluetooth: this.bluetooth });
    popover.present({
      ev: myEvent
    });
  }

  updateLocs() {
    console.log('ampashu ... ');
    
    const trackeesLen = this.trackeesList.length;
    let curTrackees = 0;

    this.trackeesList.map((trackee, idx) => {
      this.trackees.getLocationById(trackee.id, (locations, err) => {
        if (locations) {
          const loc = locations[0].location;
          const timeAgo = moment(locations[0].timestamp).fromNow();
          if (!this.trackeesList[idx].circle) {
            console.log("A: " + JSON.stringify(loc));
            let circle = new google.maps.Circle({
              strokeColor: '#F57C00',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FFE0B2',
              fillOpacity: 0.35,
              map: this.gmap,
              center: { lat: loc.latitude, lng: loc.longitude },
              radius: loc.accuracy
            });
            this.trackeesList[idx].circle = circle;
          } else {
            console.log("B: " + JSON.stringify(loc));
            this.trackeesList[idx].circle.setCenter({ lat: loc.latitude, lng: loc.longitude });
          }

          if (!this.trackeesList[idx].overlay) {
            var customTxt = `
              <div style="transform:translateX(-50%);">
                <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 7px solid #26c6da; margin-left: auto; margin-right: auto"></div> 
                <div style="background-color: #26c6da; color: #fff; padding: 5px 15px 8px 15px; width: 135px; text-align: center;">
                  <h3 style=" margin-top: 0px; margin-bottom: 0px; font-size: 2rem;" > ${trackee.name} </h3> 
                </div>
                <div style="text-align: center; margin-top: -7px;"> 
                  <span style="background-color: #fff; font-size: 1rem; padding: 2px; text-align: center;"> ${timeAgo} </span>
                </div>
              </div>
            `;
            var overlay = new TxtOverlay(new google.maps.LatLng(loc.latitude, loc.longitude), customTxt, "customBox", this.gmap, () => {
              this.bluetooth.stopScan();
              this.nav.push(TrackeeDetailPage, {
                trackee: trackee, location: loc
              });
            });
            this.trackeesList[idx].overlay = overlay;
          } else {
            this.trackeesList[idx].overlay.setPosition(new google.maps.LatLng(loc.latitude, loc.longitude));
          }
        }
        

        if (curTrackees++ == trackeesLen - 1) {
          setTimeout(this.updateLocs.bind(this), 1000);
        }
      });
    });
  }

  initJSMaps(mapEle) {
    this.gmap = new google.maps.Map(mapEle, {
      center: { lat: -6.2416331, lng: 106.7945741 },
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    this.gmap.setOptions({ minZoom: 11, maxZoom: 20 });

    this.trackeesList = [];

    this.trackees.getList((data) => {
      this.trackeesList = data;
      setTimeout(this.updateLocs.bind(this), 500);
    });
  }

  initNativeMaps(mapEle) {
    this.map = new GoogleMap(mapEle);
    mapEle.classList.add('show-map');

    GoogleMap.isAvailable().then(() => {
      const position = new GoogleMapsLatLng(-6.2416331, 106.7945741);
      this.map.setPosition(position);
    });
  }

  ionViewDidLoad() {
    let mapEle = this.map.nativeElement;

    if (!mapEle) {
      console.error('Unable to initialize map, no map element with #map view reference.');
      return;
    }

    this.initJSMaps(mapEle);
    if (this.flag) {
      this.continuousScan();
    }
  }

  setCenterToMe() {
    this.geolocation.getCurrentPosition().then((response) => {
        const pos = {
          lat: response.coords.latitude,
          lng: response.coords.longitude
        };

        this.gmap.setCenter(pos);
        if (!this.mypos) {
          this.mypos = new google.maps.Marker({
            position: pos,
            icon: 'assets/img/my-location-icon.png',
            map: this.gmap
          });
        } else {
          this.mypos.setPosition(pos);
        }
    });
  }

  selectAll() {
    this.appliedFilter = "all";
    this.trackeesList.map((t, idx) => {
      this.trackeesList[idx].overlay.show();
      this.trackeesList[idx].circle.setMap(this.gmap);
    });
  }

  selectCategory(category) {
    this.appliedFilter = category;
    this.trackeesList.map((t, idx) => {
      if (t.category == category) {
        this.trackeesList[idx].overlay.show();
        this.trackeesList[idx].circle.setMap(this.gmap);
      } else {
        this.trackeesList[idx].overlay.hide();
        this.trackeesList[idx].circle.setMap(null);
      }
    });
  }

  continuousScan() {
    const self = this;
    const onDeviceFound = (device) => {
      console.log('Device found:', device);
      self.devices.push(device);
    }

    this.devices = [];
    this.bluetooth.scanIndefinitely(onDeviceFound, false);

    setTimeout(() => {
      self.bluetooth.stopScan();
      if (self.devices.length) {
        if (self.flag) {
          self.sendUpdates();
          self.continuousScan();
        } else {
          self.geolocation.getCurrentPosition().then((response) => {
            console.log('Location:', response);
            if (response.coords) {
              self.lastKnownLocation = self.geopositionToObject(response).coords;
            }
            self.sendUpdates();
            // continue scanning
            self.continuousScan();
          }).catch((error) => {
            console.log('Error getting location:', error);
            // send updates anyway
            // TODO: take into account headings and speed to estimate current location
            self.sendUpdates();
            // continue scanning
            self.continuousScan();
          });
        }
      } else {
        // continue scanning indefinitely
        self.continuousScan();
      }
    }, 3000);
  }

  geopositionToObject(geoposition) {
    return {
      timestamp: geoposition.timestamp,
      coords: {
        accuracy: geoposition.coords.accuracy,
        altitude: geoposition.coords.altitude,
        altitudeAccuracy: geoposition.coords.altitudeAccuracy,
        heading: geoposition.coords.heading,
        latitude: geoposition.coords.latitude,
        longitude: geoposition.coords.longitude,
        speed: geoposition.coords.speed
      }
    }
  }

  sendUpdates() {
    if (this.devices.length) {
      // send updates
      const obj = {
        flag: this.flag,
        location: this.lastKnownLocation,
        devices: this.devices
      };
      console.log('sending updates ...', obj);
      this.http.post('http://gotrack.susan.to/location', obj)
        .subscribe(() => {
          console.log('sending updates success');
        }, (err) => {
          console.log('sending updates failed:', err);
        });
    }
  }
}
