import {TabsPage} from './../pages/tabs/tabs.page';
import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {PermissionsPage} from "../pages/permissions/permissions";

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
  rootPage = PermissionsPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              private splashScreen: SplashScreen) {
    platform.ready().then(() => {


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
      }, 1500);
    }
  }
}
