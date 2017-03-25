import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TrackeeDetailPage } from '../trackee-detail/trackee-detail';

@Component({
    templateUrl: 'trackee-list.html'
})
export class TrackeeListPage {
  constructor(private nav: NavController) {}

  goToDetail() {
    this.nav.push(TrackeeDetailPage)
  }
}