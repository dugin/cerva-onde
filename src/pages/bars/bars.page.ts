import {BarModel} from './../../model/bar';
import {BarsService} from './bars.service';
import {BarDetailPage} from './../bar-detail/bar-detail';
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {StatusBar} from "@ionic-native/status-bar";
import {Firebase} from '@ionic-native/firebase';

@Component({
  selector: 'ib-page-bars',
  templateUrl: 'bars.page.html',
})
export class BarsPage {

  isLoading = true;
  bars = new Array<BarModel>()

  constructor(public navCtrl: NavController,
              public barsService: BarsService,
              statusBar: StatusBar,
              private firebase: Firebase
  ) {

    statusBar.backgroundColorByHexString('#cccccc');
  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad');

    this.firebase.setScreenName('Bar List');

    this.barsService.getMyLocationInfo()
      .mergeMap((location) => this.barsService.getBars(location.latLng, 5000))
      .subscribe(data => {
        this.setIsLoading();
        this.bars = data;

      })

  }

  roundDistance(distance: number) {
    return Math.round(distance * 100) / 100
  }


  onCard(bar: BarModel) {
    this.navCtrl.push(BarDetailPage, {bar: bar});
  }

  setIsLoading() {
    this.isLoading = !this.isLoading;
  }
}
