import {BarModel} from './../model/bar';
import {PlacesService} from './places.service';
import {FirebaseService} from './firebase.service';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {BeerModel} from "../model/beer";
import {BeersBarModel} from "../model/beers-bar";
import * as moment from 'moment';
import {BeersBarLogModel} from "../model/beers-bar-log";
import {BeerTempModel} from '../model/beerTemp';
/*
 Generated class for the Suggest provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class SuggestService {

  beerSizes: Promise<Array<string>>;
  beersDB = new Map<string, any>();
  beersString = new Array<string>();

  constructor(public placesService: PlacesService,
              public firebaseService: FirebaseService) {
    console.log('Hello Suggest Provider');
    this.getBeerSizes();
    this.getBeers();
  }

  getBar(name: string, neighborhood: string, city: string): Observable<BarModel> {

    return this.placesService.getPlaces(name, neighborhood, city)
      .map((response: any) => response[0].place_id)
      .mergeMap(this.placesService.getPlacesDetails)
      .map((result: any) => {

        const bar = new BarModel();
        bar.address = this.placesService.setAddress(result);
        bar.name = result.name;
        bar.openingHours = this.placesService.setOpeningHours(result);
        bar.tel = result.formatted_phone_number;
        bar.photos = this.placesService.setPhotos(result, 5);

        return bar;
      });

  }

  getBeerSizes() {

    const arr = new Array<string>();

    this.beerSizes = new Promise((resolve) => {

      this.firebaseService.getBeerSizes()
        .subscribe((val: any) => {

          val.forEach((el: any) => {

            let beerSize: string = el.$value;

            const temp = beerSize.substring(beerSize.indexOf('_') + 1)

            arr.push(temp);

          });

          resolve(arr);
        });

    });
  }


  getBeers() {
    let subs = this.firebaseService.getBeers()
      .subscribe((data) => {

        data.forEach(el => {

          this.beersString.push(el.name);

          el.id = el.$key;
          delete el.$key;
          delete el.$exists;
          this.beersDB.set(el.name, el);

        });

        subs.unsubscribe();
      })
  }

  pushBarToFirebase(bar: BarModel, beers: BeersBarModel[], beersTemp: BeerTempModel[]) {

    bar.createdAt = moment().toJSON();
    let i = -1;
    let j = -1;
    let z = -1;

    console.log('beersTemp ', beersTemp);



    return this.firebaseService.pushBar(bar)
      .map((data) => {
        this.firebaseService.barKey = data.path.o[1];
        this.setBarKeyToBeer(beers, beersTemp);

      })
      .mergeMap(() => this.firebaseService.pushUsersLog(0, bar.userID, this.firebaseService.barKey, bar.name))
      .mergeMap(() => this.firebaseService.setGeofire(bar.address.coordinates))
      .mergeMap(() => this.firebaseService.pushBeersBar(beers))
      .map((data) => {
        console.log(data);
        i++;
        this.firebaseService.beerKey = data.path.o[1];

        (bar.beers as string[]).push(data.path.o[1]);

        return beers[i].price;
      })
      .mergeMap(() => {

        console.log(i);
        console.log(beersTemp.length);
        if (beers[i].beer.id.length == 0) {
          z++;
          beersTemp[z].beersBarID = this.firebaseService.beerKey;

          return this.firebaseService.pushBeersTemp(beersTemp[z]);
        }

        return Observable.of('');
      })
      .mergeMap(() => this.firebaseService.pushBeersBarLog(new BeersBarLogModel(null, beers[i].price, bar.userID)))
      .mergeMap(() => this.firebaseService.updateBar(bar.beers))
      .do(() => j++)
      .mergeMap(() => this.firebaseService.pushUsersLog(1, bar.userID, null, bar.name, bar.beers[j], beers[j].beer.name))


  }

  private setBarKeyToBeer(beers: BeersBarModel[], beersTemp: BeerTempModel[]) {

    beers.forEach(beer => {
      beer.barID = this.firebaseService.barKey;
    });

    beersTemp.forEach(beer => {
      beer.barID = this.firebaseService.barKey;
    });

  }


  errorHandler(err: string) {
    return this.placesService.errorHandler(err);
  }

}
