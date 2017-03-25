import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TrackeeDetailPage } from '../trackee-detail/trackee-detail';
import { Trackees } from '../../providers/providers';
import moment from 'moment';

@Component({
    templateUrl: 'trackee-list.html'
})
export class TrackeeListPage {
  trackeeAndLocationList: any;
  trackeeAndLocationListToday: any;
  trackeeAndLocationListThisWeek: any;
  constructor(private nav: NavController, private trackees: Trackees) {
    this.trackeeAndLocationList = [];
    this.trackeeAndLocationListToday = [];
    this.trackeeAndLocationListThisWeek = [];
    this.trackees.getList((data) => {
      data.map((trackee, idx) => {
        this.trackees.getLocationById(trackee.id, (locations) => {
          const now = moment();
          const ts = moment(locations[0].timestamp);
          const daysDiff = now.diff(ts, 'days');
          if (daysDiff < 1) {
            this.trackeeAndLocationListToday.push({
              trackee: trackee,
              location: locations[0].location,
            });
          } else if (daysDiff < 7) {
            this.trackeeAndLocationListThisWeek.push({
              trackee: trackee,
              location: locations[0].location,
            });
          } else {
            this.trackeeAndLocationList.push({
              trackee: trackee,
              location: locations[0].location,
            });
          }
        });
      });
    });
  }

  goToDetail(tl) {
    this.nav.push(TrackeeDetailPage, tl);
  }
}