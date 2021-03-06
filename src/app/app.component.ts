import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Geolocation} from '@ionic-native/geolocation';

import {TabsPage} from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(private platform: Platform, statusBar: StatusBar,
              splashScreen: SplashScreen,
              private geo: Geolocation) {
    platform.ready().then(() => {
      console.log('ready');

      this.geo.getCurrentPosition()
        .then(i => console.log('success', i))
        .catch(i => console.log('error', i))
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


}
