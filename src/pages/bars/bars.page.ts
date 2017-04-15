import { BarModel } from './../../model/bar';
import { BarsService } from './bars.service';
import { BarDetailPage } from './../bar-detail/bar-detail';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'ib-page-bars',
    templateUrl: 'bars.page.html',
})
export class BarsPage {

    isLoading = true;
    bars = new Array<BarModel>()

    constructor(public navCtrl: NavController,
        public barsService: BarsService

    ) {
    }


    ionViewDidLoad() {

        this.barsService.getMyLatLng()
          .mergeMap((latLng)=> this.barsService.getBars(latLng, 50))
          .subscribe(data => {
            this.setIsLoading();
            this.bars = data;

          })

    }

    roundDistance(distance: number) {
        return Math.round(distance * 100) / 100
    }


    onCard(bar: BarModel) {
                this.navCtrl.push(BarDetailPage, { bar: bar });
    }

    setIsLoading() {
        this.isLoading = !this.isLoading;
    }
}
