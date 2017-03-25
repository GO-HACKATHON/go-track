import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TrackeeDetailPage } from '../trackee-detail/trackee-detail';
import { Trackees } from '../../providers/providers';

@Component({
    templateUrl: 'trackee-list.html'
})
export class TrackeeListPage {
  trackeeAndLocationList: any;
  constructor(private nav: NavController, private trackees: Trackees) {
    this.trackeeAndLocationList = [];
    this.trackees.getList((data) => {
      data.map((trackee, idx) => {
        this.trackees.getLocationById(trackee.id, (locations) => {
          this.trackeeAndLocationList.push({
            trackee: trackee,
            location: locations[0].location,
          });
        });
      });
    });
  }

  goToDetail(tl) {
    this.nav.push(TrackeeDetailPage, tl);
  }
}