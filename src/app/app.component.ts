import {TabsPage} from './../pages/tabs/tabs.page';
import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {PermissionsPage} from "../pages/permissions/permissions";
import {Diagnostic} from "@ionic-native/diagnostic";
import {LoginPage} from '../pages/login/login';
import {FirebaseService} from '../providers/firebase.service';
import {FacebookService} from '../providers/facebook.service';
import {mergeMap} from 'rxjs/operator/mergeMap';
import {Observable} from 'rxjs';
import {DiagnosticService} from '../providers/diagnostic.service';
import {SuggestPage} from '../pages/suggest/suggest';
import {SuggestBeerPage} from '../pages/suggest-beer/suggest-beer';

@Component({
  template: `
    <ion-menu swipeEnabled="false" [content]="content" side="left" id="menu1">
      <ib-page-nearby></ib-page-nearby>
    </ion-menu>
    <ion-menu swipeEnabled="false" [content]="content" side="right" id="menu2">
      <ib-page-beers></ib-page-beers>
    </ion-menu>
    <ion-nav #content [root]="rootPage"></ion-nav>`,
})
export class MyApp {
  rootPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private diagnosticService: DiagnosticService,
              private facebookService: FacebookService,) {

    platform.ready().then(() => {
    this.rootPage = SuggestBeerPage;

      // const subs = facebookService.isLoggedIn()
      //   .mergeMap((data) => {
      //
      //   if (data.status.localeCompare('unknown') === 0) {
      //     this.rootPage = LoginPage;
      //     return Observable.empty();
      //
      //   } else {
      //     return this.diagnosticService.locationEnabled()
      //   }
      //
      // })
      //   .subscribe((data: boolean | null) => {
      //
      //     if (typeof data === 'boolean' )
      //       if(data)
      //         this.rootPage = TabsPage;
      //     else
      //         this.rootPage = PermissionsPage;
      //
      //     subs.unsubscribe();
      //
      //   });


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.hideSplashScreen();


    });
  }

  hideSplashScreen() {

    if (this.splashScreen) {
      setTimeout(() => {
        // alert("Vou esconder Splashscreen");
        this.splashScreen.hide();
      }, 1000);
    }
  }
}
