import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import {Diagnostic} from '@ionic-native/diagnostic';
import {LocationAccuracy} from '@ionic-native/location-accuracy';

import {TabsPage} from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(private platform: Platform, statusBar: StatusBar,
              splashScreen: SplashScreen,
              private diagnostic: Diagnostic,
              private locationAccuracy: LocationAccuracy,
              private geo: Geolocation) {
    platform.ready().then(() => {
      console.log('ready');

      this.getUserPosition()
        .then(i => console.log(i))
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  getUserPosition() {
    return new Promise(resolve => {
      const HIGH_ACCURACY = 'high_accuracy';
      if (this.platform.is('cordova')) {
        this.platform.ready().then(() => {
          this.diagnostic.isLocationEnabled().then(enabled => {
            if (enabled) {
              if (this.platform.is('android')) {
                this.diagnostic.getLocationMode().then(locationMode => {
                  if (locationMode === HIGH_ACCURACY) {
                    this.geo.getCurrentPosition({timeout: 30000, maximumAge: 0, enableHighAccuracy: true}).then(pos => {
                      resolve({
                        coords: {
                          latitude: pos.coords.latitude,
                          longitude: pos.coords.longitude
                        }
                      });
                    }).catch(error => resolve(error));
                  } else {
                    this.askForHighAccuracy().then(available => {
                      if (available) {
                        this.getUserPosition().then(a => resolve(a), e => resolve(e));
                      }
                    }, error => resolve(error));
                  }
                });
              } else {
                
                this.geo.getCurrentPosition({timeout: 30000, maximumAge: 0, enableHighAccuracy: true}).then(pos => {
                  resolve({
                    coords: {
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude
                    }
                  });
                }).catch(error => resolve(error));
              }
            } else {
              this.locationAccuracy.request(1).then(result => {
                if (result) {
                  this.getUserPosition().then(result => resolve(result), error => resolve(error));
                }
              }, error => {
                resolve(error)
              });
            }
          }, error => {
            resolve(error)
          });
        });
      } else {
        resolve('Cordova is not available');
      }
    });
  }

  askForHighAccuracy(): Promise<Geoposition> {
    return new Promise(resolve => {
      this.locationAccuracy
        .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
        this.geo.getCurrentPosition({timeout: 30000}).then(
          position => {
            resolve(position);
          }, error => resolve(error)
        );
      }, error => resolve(error));
    });
  }

}
