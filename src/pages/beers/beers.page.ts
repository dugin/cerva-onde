import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';


@Component({
    selector: 'ib-page-beers',
    templateUrl: 'beers.page.html'

})
export class BeersPage implements OnInit {
   isIOS: boolean;

    constructor(public platform: Platform) { }

    ngOnInit() {
        this.isIOS = this.platform.is('ios');
     }
}
