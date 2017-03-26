import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ViewController, AlertController, NavParams } from 'ionic-angular';
import { GoogleMap, GoogleMapsLatLng } from 'ionic-native';
import { TrackeeAddPage } from '../trackee-add/trackee-add';
import { SensePage } from '../sense/sense';
import { NotificationHistoryPage } from '../notification-history/notification-history';

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
  templateUrl: 'trackee-detail.html',
})
export class TrackeeDetailPage {
  @ViewChild('map') map;
  public trackee: any;
  public location: any;

  constructor(public nav: NavController, private navParams: NavParams, public platform: Platform, public alert: AlertController) {
    this.trackee = navParams.get('trackee'); 
    this.location = navParams.get('location');
  }

  initJSMaps(mapEle) {
    let map = new google.maps.Map(mapEle, {
      center: { lat: this.location.latitude, lng: this.location.longitude },
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    map.setOptions({ minZoom: 11, maxZoom: 20 });

    new google.maps.Circle({
      strokeColor: '#F57C00',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FFE0B2',
      fillOpacity: 0.35,
      map: map,
      center: { lat: this.location.latitude, lng: this.location.longitude },
      radius: this.location.accuracy
    });

    var customTxt = `
      <div style="transform:translateX(-50%);">
        <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 7px solid #26c6da; margin-left: auto; margin-right: auto" ></div> 
        <div style="background-color: #26c6da; color: #fff; padding: 5px 15px 8px 15px; width: 135px; text-align: center;">
          <h3 style=" margin-top: 0px; margin-bottom: 0px; font-size: 2rem;" > ${this.trackee.name} </h3> 
        </div>
        <div style="text-align: center; margin-top: -7px;"> 
          <span style="background-color: #fff; font-size: 1rem; padding: 2px; text-align: center;"> 22 min ago </span>
        </div>
      </div>
    `;

    new TxtOverlay(new google.maps.LatLng(this.location.latitude, this.location.longitude), customTxt, "customBox", map, () => {});
  }
  ionViewDidLoad() {
    let mapEle = this.map.nativeElement;

    if (!mapEle) {
      console.error('Unable to initialize map, no map element with #map view reference.');
      return;
    }
    this.initJSMaps(mapEle);
  }

  goToEdit() {
    this.nav.push(TrackeeAddPage);
  }

  goToSense() {
    this.nav.push(SensePage);
  }

  goToNotificationHistory() {
    this.nav.push(NotificationHistoryPage, {
      trackee: this.trackee
    });
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
