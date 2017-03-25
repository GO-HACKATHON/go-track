import { Component } from '@angular/core';

import { MenuController, NavController } from 'ionic-angular';

import { MapPage } from '../map/map';
import { GojekMenuPage } from  '../gojek-menu/gojek-menu';

import { TranslateService } from 'ng2-translate/ng2-translate';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public translate: TranslateService) {
    this.slides = [
      {
        title: "Introducing GO-TRACK",
        description: "The best solution for tracking anything in the city",
        image: 'assets/img/phone.png',
      },
      {
        title: "Never lost your anything again",
        description: "Protect your belonging and your beloved family member",
        image: 'assets/img/blues.png',
      },
      {
        title: "Just try!",
        description: "Just do it! Future is here!",
        image: 'assets/img/ica-slidebox-img-3.png',
      }
    ];
  }

  startApp() {
    this.navCtrl.setRoot(GojekMenuPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
