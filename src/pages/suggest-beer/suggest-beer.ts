import {BeersBarModel} from './../../model/beers-bar';
import {BarModel} from './../../model/bar';
import {SuggestService} from './../../providers/suggest.service';
import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';
import {Firebase} from '@ionic-native/firebase';
import {BarDetailPage} from '../bar-detail/bar-detail';
import {LocationService} from '../../providers/location.service';
import {StringUtil} from '../../util/stringUtil';
import {BeerTempModel} from '../../model/beerTemp';
import * as moment from 'moment';
/*
 Generated class for the SuggestBeer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-suggest-beer',
  templateUrl: 'suggest-beer.html'
})
export class SuggestBeerPage {


  beerSizes = new Array<string>();
  bar = new BarModel();
  beerBar = new Array<BeersBarModel>();
  beersDB = this.suggestService.beersDB;
  beersString = this.suggestService.beersString;
  aux = new Array<any>();
  showAutoComplete = new Array<{ autoComplete: boolean, notFound: boolean }>();
  shouldSelectAutoComplete = new Array<boolean>();
  showModalOnce = true;
  loadingModal;
  didClickOnSubmit = false;
  beersTemp = Array<BeerTempModel>();
  beerNameTemp = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public suggestService: SuggestService,
              private alertCtrl: AlertController,
              private firebase: Firebase,
              private locationService: LocationService,
              public loadingCtrl: LoadingController) {


  }

  ionViewDidLoad() {

    this.firebase.setScreenName('Bar Register 2');

    this.bar = this.navParams.get('bar');

    this.bar.tel = this.bar.tel ? this.bar.tel : '';

    console.log(this.bar);
    this.bar.userID = this.navParams.get('userUID');

    this.addBeer();

    this.suggestService.beerSizes
      .then(val => {
        this.beerSizes = val;
      });


    this.aux = _.cloneDeep(this.beersString);
    console.log('ionViewDidLoad SuggestBeerPage');
  }


  reset(i) {

    this.beersString = _.cloneDeep(this.aux);
    this.showAutoComplete[i].autoComplete = false;
  }

  selectAutoComplete(beer: string, i: number) {

    this.beerBar[i].beer.name = beer;
    this.showAutoComplete[i].autoComplete = false;

    this.beerBar[i].beer = this.beersDB.get(beer);

    this.shouldAddBeer(i);

  }

  selectBeerNotFound(i) {

    this.showAutoComplete[i].autoComplete = false;
    this.showAutoComplete[i].notFound = true;

    this.beerBar[i].beer.name = this.beerNameTemp;
    this.shouldAddBeer(i);

  }

  autoCompleteBeers(ev: any, i) {
    // Reset items back to all of the items

    this.reset(i);
    // set val to the value of the searchbar
    const val = ev.target.value;

    this.beerNameTemp = val;

    if (!val || val.length == 0)
      this.showAutoComplete[i].notFound = false;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '' && !this.showAutoComplete[i].notFound) {

      this.beersString = this.beersString.filter((item) => {
        return StringUtil.removeAccent(item).toLowerCase().indexOf(StringUtil.removeAccent(val).toLowerCase().replace(/\s/g, '')) > -1;
      });

      this.showAutoComplete[i].autoComplete = true;

    }

  }


  onKey(i: any) {

    this.shouldAddBeer(i);

  }

  onChangeSize(event: any, i: number) {
    this.beerBar[i].size = event;

    this.shouldAddBeer(i);

  }

  shouldAddBeer(i) {

    if (this.checkAllFieldsFilled(i) && (i == this.beerBar.length - 1)) {

      if (this.showAutoComplete[i].notFound) {

        console.log('notFound');

        this.beersTemp.push(new BeerTempModel(
          this.beerBar[i].beer.name,
          this.beerBar[i].price,
          this.beerBar[i].size,
          this.bar.userID,
          '',
          moment().toJSON()
        ));
      }

      console.log(this.beersTemp);

      this.addBeer();
    }


  }


  checkAllFieldsFilled(i: number) {
    return this.beerBar[i].beer.name.length > 0 && this.beerBar[i].size.length > 0 && this.beerBar[i].price;
  }

  addBeer() {

    this.beerBar.push(new BeersBarModel());
    this.showAutoComplete.push({autoComplete: false, notFound: false});
    this.shouldSelectAutoComplete.push(false);

  }

  onRegister() {

    console.log('onRegister');
    console.log(this.beersTemp);
    console.log(this.beerBar);

    if (this.checkAllFieldsFilled(0)) {

      this.sanitizeArray();

      if (!this.didClickOnSubmit) {

        this.presentLoading();

        this.isAllBeersNew();

        this.suggestService.pushBarToFirebase(this.bar, this.beerBar, this.beersTemp)
          .subscribe(() => {

              if (this.showModalOnce) {

                if (this.beerBar.length === this.beersTemp.length) {
                  this.presentAlert('Bar Cadastrado com sucesso', 'As novas cervejas serão avaliadas e então inseridas no bar. Obrigado!');
                  this.navCtrl.pop();
                }
                else {
                  this.presentAlert('Obrigado!', 'Bar Cadastrado com sucesso');
                  this.calcDistance();
                  this.goToBeerPage();
                }


              }
              this.showModalOnce = false;


            },
            (error) => {
              console.error(error);
              this.presentAlert('Erro', 'Problema ao Cadastrar o bar');
              this.navCtrl.pop();
            });

        this.didClickOnSubmit = true;
      }


    } else
      this.presentAlert('Erro', 'Pelo menos uma cerveja tem de ser adicionada')

  }

  goToBeerPage() {
    const index = this.navCtrl.getActive().index;

    this.navCtrl.push(BarDetailPage, {bar: this.bar})
      .then(() => {

        this.navCtrl.remove(index, 1);
      })

  }

  isAllBeersNew() {
    if (this.beerBar.length === this.beersTemp.length)
      this.bar.type = -2;
  }


  calcDistance() {
    this.bar.distance = this.locationService.getDistanceFromLatLonInKm(
      this.bar.address.coordinates.lat,
      this.bar.address.coordinates.lng,
      LocationService.myLocation.latLng[0],
      LocationService.myLocation.latLng[1]);
  }

  sanitizeArray() {

    for (let i = this.beerBar.length - 1; i > -1; i--) {
      if (this.checkAllFieldsFilled(i) && !this.beerBar[i].beer.id) {
        this.beerBar[i] = new BeersBarModel();
      }
      else if (!this.checkAllFieldsFilled(i) || !this.beerBar[i].beer) {
        this.beerBar.pop();
      }
    }

  }

  private presentLoading() {
    this.loadingModal = this.loadingCtrl.create({
      content: 'Cadastrando Bar...'
    });

    this.loadingModal.present();

  }


  private presentAlert(title, msg) {

    if (this.loadingModal)
      this.loadingModal.dismiss();

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
