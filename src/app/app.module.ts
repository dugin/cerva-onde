// MODULES
import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {AngularFireModule} from 'angularfire2';


// SERVICES
import {BarsService} from './../pages/bars/bars.service';
import {BeersService} from './../pages/beers/beers.service';
import {NearbyBarsService} from './../pages/nearby/nearby-bars.service';
import {PlacesService} from './../providers/places.service';
import {GeocoderService} from './../providers/geocoder.service';
import {SuggestService} from './../providers/suggest.service';
import {FirebaseService} from './../providers/firebase.service';
import {BarDetailService} from './../pages/bar-detail/bar-detail.service';

import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
// PAGES
import {ProfilePage} from './../pages/profile/profile';
import {TabsPage} from '../pages/tabs/tabs.page';
import {BeersPage} from './../pages/beers/beers.page';
import {BarsPage} from './../pages/bars/bars.page';
import {NearbyBarsPage} from './../pages/nearby/nearby-bars.page';
import {BarDetailPage} from './../pages/bar-detail/bar-detail';
import {SuggestPage} from './../pages/suggest/suggest';
import {LoginPage} from './../pages/login/login';
import {PermissionsPage} from '../pages/permissions/permissions';
import {SuggestBeerPage} from './../pages/suggest-beer/suggest-beer';
import {Geolocation} from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';


import {MyApp} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {LocationService} from "../providers/location.service";
import { FacebookService} from '../providers/facebook.service';
import {Facebook} from '@ionic-native/facebook';
import {DiagnosticService} from '../providers/diagnostic.service';
// Must export the config
export const firebaseConfig = {
  apiKey: 'AIzaSyCus43rxj_lqCKqk1jYPKDCvce28XGVlEU',
  authDomain: 'cervaonde-c97ab.firebaseapp.com',
  databaseURL: 'https://cervaonde-c97ab.firebaseio.com',
  storageBucket: 'cervaonde-c97ab.appspot.com',
  messagingSenderId: '1036657416571'
};


@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    BarsPage,
    TabsPage,
    NearbyBarsPage,
    BeersPage,
    BarDetailPage,
    SuggestPage,
    LoginPage,
    PermissionsPage,
    SuggestBeerPage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserModule,
    HttpModule,


    IonicModule.forRoot(MyApp, {
      menuType: 'overlay',
      platforms: {
        ios: {
          menuType: 'overlay',
        },
      },
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    BarsPage,
    TabsPage,
    NearbyBarsPage,
    BeersPage,
    BarDetailPage,
    SuggestPage,
    LoginPage,
    PermissionsPage,
    SuggestBeerPage
  ],
  providers: [
    BarsService,
    NearbyBarsService,
    BeersService,
    GeocoderService,
    PlacesService,
    SuggestService,
    FirebaseService,
    BarDetailService,
    StatusBar,
    SplashScreen,
    Geolocation,
    LocationService,
    Diagnostic,
    FacebookService,
    Facebook,
    DiagnosticService

  ],
})
export class AppModule {
}
