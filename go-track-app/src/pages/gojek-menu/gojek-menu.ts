import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';


@Component({
  templateUrl: 'gojek-menu.html'
})
export class GojekMenuPage {

  constructor(public nav: NavController) {
    
  }
  
  goToMap(flag = undefined) {
    this.nav.push(MapPage, { flag: flag });
  }

}
