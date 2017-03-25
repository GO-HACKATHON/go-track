import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { GoogleMap, GoogleMapsLatLng } from 'ionic-native';
import { PopoverController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { TrackeeAddPage } from '../trackee-add/trackee-add';
import { TrackeeListPage } from '../trackee-list/trackee-list';
import { TrackeeDetailPage } from '../trackee-detail/trackee-detail';
import { SettingsPage } from '../settings/settings';
import { Trackees } from '../../providers/providers';

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
  constructor(public viewCtrl: ViewController, private nav: NavController) {}

  close() {
    this.viewCtrl.dismiss();
  }
  goToAddTrackee() {
    this.viewCtrl.dismiss();
	  this.nav.push(TrackeeAddPage);
  }
  goToListTrackee() {
    this.viewCtrl.dismiss();
	  this.nav.push(TrackeeListPage);
  }
  goToSetting() {
    this.viewCtrl.dismiss();
	  this.nav.push(SettingsPage);
  }
}


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  trackeeList: any;
  circleList: any;
  overlayList: any;
  gmap: any;
  @ViewChild('map') map;

  constructor(public nav: NavController, public platform: Platform, public popoverCtrl: PopoverController, private trackees: Trackees) {}

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
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

    this.trackeeList = [];
    this.overlayList = [];
    this.circleList = [];

    this.trackees.getList((data) => {
      data.map((trackee, idx) => {
        this.trackees.getLocationById(trackee.id, (locations) => {
          var loc = locations[0].location;

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
          

          var customTxt = `
            <div style="transform:translateX(-50%);">
              <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 7px solid #26c6da; margin-left: auto; margin-right: auto"></div> 
              <div style="background-color: #26c6da; color: #fff; padding: 5px 15px 8px 15px; width: 135px; text-align: center;">
                <h3 style=" margin-top: 0px; margin-bottom: 0px; font-size: 2rem;" > ${trackee.name} </h3> 
              </div>
              <div style="text-align: center; margin-top: -7px;"> 
                <span style="background-color: #fff; font-size: 1rem; padding: 2px; text-align: center;"> 22 min ago </span>
              </div>
            </div>
          `;
          this.trackeeList.push(trackee);
          this.circleList.push(circle);
          var overlay = new TxtOverlay(new google.maps.LatLng(loc.latitude, loc.longitude), customTxt, "customBox", this.gmap, () => {
            this.nav.push(TrackeeDetailPage, {
              trackee: trackee, location: loc
            });
          });
          this.overlayList.push(overlay);
        });
      });
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
  }

  selectAll() {
    this.trackeeList.map((t, idx) => {
      this.overlayList[idx].show();
      this.circleList[idx].setMap(this.gmap);
    });
  }

  selectCategory(category) {
    this.trackeeList.map((t, idx) => {
      if (t.category == category) {
        this.overlayList[idx].show();
        this.circleList[idx].setMap(this.gmap);
      } else {
        this.overlayList[idx].hide();
        this.circleList[idx].setMap(null);
      }
    });
  }

}
