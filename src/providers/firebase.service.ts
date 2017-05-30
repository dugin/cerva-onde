import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {BarModel} from './../model/bar';
import {Injectable, Inject} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFire, AuthMethods, AuthProviders, FirebaseApp, FirebaseListObservable} from 'angularfire2';
import * as firebase from 'firebase';
import {BeersBarModel} from "../model/beers-bar";
import {BeersBarLogModel} from "../model/beers-bar-log";
declare var require: any

var GeoFire = require('../../node_modules/geofire/dist/geofire.js');

/*
 Generated class for the Firebase provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FirebaseService {

  geoFire = new GeoFire(this.firebaseApp.database().ref('coordinates'));
  barKey: string;
  beerKey: string;


  constructor(public af: AngularFire,
              @Inject(FirebaseApp) public firebaseApp: any) {
    console.log('Hello Firebase Provider');

    this.getBeerFromBar = this.getBeerFromBar.bind(this);
  }


  logOut() {
    return  this.firebaseApp.auth().signOut();
  }

  getLoggedUser() {

    return new Observable<any>((observer) => {

      this.firebaseApp.auth().onAuthStateChanged(next => {
          observer.next(next);
        }, (error) => {
          observer.error(error);
        },
        () => {
          observer.complete();
        });


    })

  }

  getUser(id) {

    return this.af.database.object('users/' + id);

  }

  loginWithFacebook(fbResponse) {

    return new Observable<any>((observer) => {

      const provider = firebase.auth.FacebookAuthProvider.credential(fbResponse.authResponse.accessToken);

      this.firebaseApp.auth().signInWithCredential(provider)
        .then((resolve) => {

          observer.next(resolve);
          observer.complete();

        })
        .catch((err) => {
          console.error(err);
          observer.error(err);
        });
    });
  }

  pushUser(user, id) {

    return new Observable<any>((observer) => {

      this.af.database.object('users/' + id)
        .set(user)
        .then(() => {
          observer.next(user);
          observer.complete();
        })
        .catch((err) => {
          console.error(err);
          observer.error(err);
        });


    });

  }


  getBeerSizes() {
    return this.af.database.list('/beerSizes', {
      query: {
        orderByValue: true,
      },
    });
  }

  pushBar(bar: BarModel) {

    return new Observable<any>(obs => {

      this.af.database.list('/bars')
        .push(bar)
        .then((data) => {
          obs.next(data);
          obs.complete();
        })
        .catch((error) => {
          obs.error(error);
        })


    })


  }

  updateBar(beersKey: Array<string>) {
    return this.af.database.list('bars')
      .update(this.barKey, {beers: beersKey});
  }

  pushBeersBarLog(beers: BeersBarLogModel) {
    return this.af.database.list('beersBarLog/' + this.beerKey)
      .push(beers);
  }


  pushBeersBar(beers: Array<BeersBarModel>): Observable<any> {

    return Observable.from(beers)
      .mergeMap((beer) => this.af.database.list('/beersBar').push(beer))


  }

  setGeofire(coord): Promise<any> {

    return this.geoFire.set(this.barKey, [coord.lat, coord.lng])

  }

  getBarsNearby(latlng: number[], radius: number) {

    const geoQuery = this.geoFire.query({
      center: latlng,
      radius: radius
    });

    return new Observable<{ key: string, distance: number }>((observer: Observer<{ key: string, distance: number }>) => {

      geoQuery.on("ready", () => {
        observer.complete();
      });

      geoQuery.on("key_entered", (key: string, location: any, distance: number) => {
        var l = location;

        observer.next({key: key, distance: distance});
      });

    })
  }

  getBar(id: string) {
    return this.af.database.object(`/bars/${id}`);

  }

  getBeerFromBar(id: string) {
    return this.af.database.object(`/beersBar/${id}`);

  }

  getBeers() {
    return this.af.database.list('beers')

  }

}
