import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Settings, Bluetooth } from '../providers/providers';

import { FirstRunPage } from '../pages/pages';
import { LoginPage } from '../pages/login/login';
import { MapPage, PopoverPage } from '../pages/map/map';
import { TrackeeAddPage } from '../pages/trackee-add/trackee-add';
import { TrackeeListPage } from '../pages/trackee-list/trackee-list';
import { TrackeeDetailPage } from '../pages/trackee-detail/trackee-detail';
import { SensePage } from '../pages/sense/sense';
import { NotificationHistoryPage } from '../pages/notification-history/notification-history';
import { GojekMenuPage } from '../pages/gojek-menu/gojek-menu';
import { SignupPage } from '../pages/signup/signup';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SettingsPage } from '../pages/settings/settings';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { BLE } from '@ionic-native/ble';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;
  devices = [];
  lastKnownLocation = undefined;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: TutorialPage },
    { title: 'Login', component: LoginPage },
    { title: 'Signup', component: SignupPage },
    { title: 'Map', component: MapPage },
    { title: 'Settings', component: SettingsPage },
    { title: 'Map Popover', component: PopoverPage },
    { title: 'Add Trackee', component: TrackeeAddPage },
    { title: 'List Trackee', component: TrackeeListPage },
    { title: 'Detail Trackee', component: TrackeeDetailPage },
    { title: 'Sense', component: SensePage },
    { title: 'Gojek', component: GojekMenuPage },
    { title: 'Notification History', component: NotificationHistoryPage }
  ]

  constructor(
      translate: TranslateService,
      platform: Platform,
      settings: Settings,
      config: Config,
      private ble: BLE,
      private geolocation: Geolocation,
      private http: Http,
      private bluetooth: Bluetooth) {
    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en');

    translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
