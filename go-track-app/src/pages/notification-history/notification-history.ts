import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
    templateUrl: 'notification-history.html'
})
export class NotificationHistoryPage {
  public trackee: any;
  constructor(private nav: NavController, private localNotifications: LocalNotifications, private navParams: NavParams,) {
    this.trackee = navParams.get('trackee'); 
    this.localNotifications.schedule({
      text: `${this.trackee.name} is moving away from you`,
      at: new Date(new Date().getTime() + 1000),
      led: 'FF0000'
    });
  }

}