import {SuggestService} from './../../providers/suggest.service';
import {BarModel} from './../../model/bar';
import {PlacesService} from './../../providers/places.service';
import {SuggestBeerPage} from './../suggest-beer/suggest-beer';
import {Component, NgZone} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import 'rxjs';
import {LocationService} from "../../providers/location.service";
import {FirebaseService} from '../../providers/firebase.service';
import {FacebookService} from '../../providers/facebook.service';
import {Firebase} from '@ionic-native/firebase';
import { Keyboard } from '@ionic-native/keyboard';

/*
 Generated class for the Suggest page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-suggest',
  templateUrl: 'suggest.html'
})
export class SuggestPage {

  isBarFound = false;
  isLoading = false;
  bar = new BarModel();
  addr = '';
  errorMsg = '';
  isLoggedIn = true;

  userUID: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public suggestService: SuggestService,
              public ngZone: NgZone,
              private firebaseService: FirebaseService,
              public facebookService: FacebookService,
              private firebase: Firebase,
              private keyboard: Keyboard) {
  }

  ionViewDidLoad() {

    this.firebase.setScreenName('Bar Register 1');
    console.log('ionViewDidLoad SuggestPage');
  }

  ionViewWillEnter() {
    this.logged();
    this.bar.address.neighborhood = LocationService.myLocation.neighborhood;
    this.bar.address.city = LocationService.myLocation.city;

    if(this.isBarFound)
    this.onClean();

  }

  logged() {

    this.firebaseService.getLoggedUser()
      .subscribe(isLogged => {
        this.ngZone.run(() => {

          console.log('logged', isLogged);

          if (isLogged) {
            this.userUID = isLogged.uid;
            this.isLoggedIn = true;
          }

          else
            this.isLoggedIn = false;

        })
      })
  }

  onLoginWithFacebook() {
    this.facebookService.onLogin()
      .subscribe(user => {
        console.log(user);
      })
  }

  onSearch() {

    if (this.validate() && !this.isBarFound) {
      this.setIsLoading();
      this.getBar();

    } else if (this.isBarFound)
      this.navCtrl.push(SuggestBeerPage, {bar: this.bar, userUID: this.userUID});


  }

  getBar() {

    this.errorMsg = '';

    this.suggestService.getBar(this.bar.name.trim(), this.bar.address.neighborhood.trim(), this.bar.address.city.trim())
      .subscribe((bar: BarModel) => {

          this.setIsBarFound();
          this.setIsLoading();

          this.ngZone.run(() => {

            this.bar = bar;
            this.addr = bar.address.street + ', ' + bar.address.number;
            this.keyboard.close();

          });

        },
        (err: any) => {

          this.ngZone.run(() => {
            this.setIsLoading();
            this.errorMsg = this.suggestService.errorHandler(err);
          });

        });

  }

  onClean() {

    this.bar = new BarModel();
    this.addr = '';
    this.errorMsg = '';

    this.setIsBarFound();
  }

  private validate() {
    return this.bar.address.city.length > 0 && this.bar.address.neighborhood.length > 0 && this.bar.name.length > 0;
  }

  private setIsLoading() {
    this.isLoading = !this.isLoading;
  }

  private setIsBarFound() {
    this.isBarFound = !this.isBarFound;
  }
}
