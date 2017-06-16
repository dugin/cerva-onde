import {BarDetailService} from './bar-detail.service';
import {TimeUtil} from './../../util/time';
import {BarModel} from './../../model/bar';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Firebase} from '@ionic-native/firebase';

declare var google: any;
/*
 Generated class for the BarDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-bar-detail',
  templateUrl: 'bar-detail.html'
})
export class BarDetailPage {

  weekday = TimeUtil.weekDay();

  isSeeMore = false;
  bar = new BarModel();
  updatedAt: string;
  @ViewChild('card') elementView: ElementRef;
  cardHeight: string;
  beersLoaded = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public barDetailService: BarDetailService,
              private firebase: Firebase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarDetailPage');

    this.firebase.setScreenName('Bar Detail');

    this.bar = this.navParams.get('bar');

    this.initMap();

    this.getBeers();

    this.updatedAt = TimeUtil.setTimeFromString(this.bar.updatedAt || this.bar.createdAt);

  }

  getBeers() {
    if (typeof this.bar.beers[0] === 'string')
      this.barDetailService.getBeer(this.bar.beers)
        .subscribe((data) => {
            this.bar.beers = data;
            this.beersLoaded = true;

          },
          (error) => {
            console.error(error);
          })
    else this.beersLoaded = true;
  }

  roundDistance() {
    return Math.round(this.bar.distance * 100) / 100
  }

  setSize(size: string) {
    return size.substring(size.indexOf('_') + 1);

  }

  onSeeMore() {
    this.isSeeMore = !this.isSeeMore;

  }

  displayPrice(price: any) {
    if (typeof price === 'string')
      return Number.parseFloat(price).toFixed(2).replace('.', ',');
    else
      return price.toFixed(2).replace('.', ',');

  }

  setWeekDay() {

    return this.weekday.weeday_short;
  }

  setTime(): any {

    if (this.bar.openingHours && this.bar.openingHours.length > 0) {
      const time = this.bar.openingHours[this.weekday.weeday_num - 1];
      if (time.open.localeCompare('') == 0)
        return {
          type: 2,
          msg: 'Não abre'

        }

      else if (time.open.localeCompare(time.close) == 0)
        return {
          type: 1,
          msg: '24 horas'
        }

      return {
        type: 0,
        open: time.open,
        close: time.close
      }


    } else
      return {
        type: 3,
        msg: 'Não cadastrado'

      }


  }

  initMap() {

    const myLatLng = {lat: this.bar.address.coordinates.lat, lng: this.bar.address.coordinates.lng};

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: myLatLng,
      disableDefaultUI: true,
    });

    const pinIcon = new google.maps.MarkerImage(
      'assets/icon/localizacao_brown.svg',
      null, /* size is determined at runtime */
      null, /* origin is 0,0 */
      null, /* anchor is bottom center of the scaled image */
      new google.maps.Size(40, 40),
    );

    new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: pinIcon,
    });
  }

}
