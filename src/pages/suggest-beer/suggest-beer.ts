import {BeersBarModel} from './../../model/beers-bar';
import {BarModel} from './../../model/bar';
import {SuggestService} from './../../providers/suggest.service';
import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';

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
  showAutoComplete = new Array<boolean>();
  shouldSelectAutoComplete = new Array<boolean>();
  showModalOnce = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public suggestService: SuggestService,
              private alertCtrl: AlertController) {


  }

  ionViewDidLoad() {

    this.bar = this.navParams.get('bar');

    this.addBeer();

    this.suggestService.beerSizes
      .then(val => this.beerSizes = val);


    this.aux = _.cloneDeep(this.beersString);
    console.log('ionViewDidLoad SuggestBeerPage');
  }


  reset(i) {

    this.beersString = _.cloneDeep(this.aux);
    this.showAutoComplete[i] = false;
  }

  selectAutoComplete(beer: string, i: number) {

    this.beerBar[i].beer.name = beer;
    this.showAutoComplete[i] = false;

    this.beerBar[i].beer = this.beersDB.get(beer);

    this.shouldAddBeer(i);

  }

  autoCompleteBeers(ev: any, i) {
    // Reset items back to all of the items

    this.reset(i);
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {

      this.beersString = this.beersString.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase().replace(/\s/g, '')) > -1);
      });

      this.showAutoComplete[i] = true;
      //  this.ngZone.run(() => { this.isSearching = true; });

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
      this.addBeer();
    }

  }


  checkAllFieldsFilled(i: number) {

    return this.beerBar[i].beer.name.length > 0 && this.beerBar[i].size.length > 0 && this.beerBar[i].price;

  }

  addBeer() {

    this.beerBar.push(new BeersBarModel());
    this.showAutoComplete.push(false);
    this.shouldSelectAutoComplete.push(false)

  }

  onRegister() {

    if (this.checkAllFieldsFilled(0)) {

      this.sanitizeArray();

      this.suggestService.pushBarToFirebase(this.bar, this.beerBar)
        .subscribe(() => {

            if (this.showModalOnce) {
              this.presentAlert('Obrigado!', 'Bar Cadastrado com sucesso');
              this.navCtrl.pop();
            }
            this.showModalOnce = false;


          },
          () => {
            this.presentAlert('Erro', 'Problema ao Cadastrar o bar')
          })


    } else
      this.presentAlert('Erro', 'Pelo menos uma cerveja tem de ser adicionada')

  }


  sanitizeArray() {

    for (let i = this.beerBar.length - 1; i > -1; i--)
      if (!this.checkAllFieldsFilled(i) || !this.beerBar[i].beer)
        this.beerBar.pop();


  }

  private presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
