import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { MapPage, PopoverPage } from '../pages/map/map';
import { TrackeeAddPage } from '../pages/trackee-add/trackee-add';
import { TrackeeListPage } from '../pages/trackee-list/trackee-list';
import { TrackeeDetailPage } from '../pages/trackee-detail/trackee-detail';
import { SensePage } from '../pages/sense/sense';
import { GojekMenuPage } from '../pages/gojek-menu/gojek-menu';
import { NotificationHistoryPage } from '../pages/notification-history/notification-history';
import { SignupPage } from '../pages/signup/signup';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SettingsPage } from '../pages/settings/settings';

import { User } from '../providers/user';
import { Api } from '../providers/api';
import { Settings } from '../providers/settings';
import { Items } from '../mocks/providers/items';
import { Bluetooth } from '../providers/bluetooth';
import { Trackees } from '../providers/trackees';
import { BLE } from '@ionic-native/ble';
import { Geolocation } from '@ionic-native/geolocation';


import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  MyApp,
  LoginPage,
  MapPage,
  PopoverPage,
  TrackeeAddPage,
  TrackeeListPage,
  TrackeeDetailPage,
  SensePage,
  NotificationHistoryPage,
  GojekMenuPage,
  SignupPage,
  TutorialPage,
  SettingsPage,
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    User,
    Api,
    Items,
    Bluetooth,
    Trackees,
    BLE,
    Geolocation,

    { provide: Settings, useFactory: provideSettings, deps: [ Storage ] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
