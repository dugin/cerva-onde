import { Platform } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ib-page-nearby',
    templateUrl: 'nearby-bars.page.html',
})
export class NearbyBarsPage implements OnInit {

    isIOS: boolean;

    constructor(public platform: Platform) { }

    ngOnInit() {
        this.isIOS = this.platform.is('ios');
     }
}
