import {GeocodingProvider} from './geocoding-provider';
import {Injectable} from '@angular/core';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import {LocationModel} from '../model/location-model';
import {Observable, Observer} from 'rxjs/Rx';
import {GeocoderService} from "./geocoder.service";

/*
 Generated class for the LocationProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class LocationService {

  position: Geoposition;

  constructor(public geocodingProvider: GeocoderService,
              public  geolocation: Geolocation) {
    console.log('Hello LocationProvider Provider');

  }


  public getMyLatLon(): Observable<number[]> {

    return Observable.fromPromise(this.geolocation.getCurrentPosition({enableHighAccuracy: true}))
      .map((position) => {
        this.position = position;
        return [position.coords.latitude, position.coords.longitude];
      });

  }

  //
  // public getMyCity(): Observable<LocationModel> {
  //
  //   return new Observable((observer: Observer<LocationModel | string>) => {
  //
  //     this.getMyLatLon()
  //       .mergeMap((latLng) => {
  //         return this.geocodingProvider.geocode(latLng);
  //
  //       })
  //
  //       .subscribe((results) => {
  //
  //           observer.next(this.setMyCity(results));
  //           observer.complete();
  //
  //         },
  //         (err) => observer.error(err))
  //     ;
  //
  //
  //   });
  //
  //
  // }
  //
  //
  // private setMyCity(results: google.maps.GeocoderResult[]): LocationModel | string {
  //
  //
  //   if (results[0]) {
  //
  //     const address = results[0].address_components;
  //     let city;
  //     let state;
  //
  //     for (let i = 0; i < address.length; i++) {
  //
  //       if (address[i].types.indexOf('locality') > -1)
  //         city = address[i].long_name;
  //
  //       if (address[i].types.indexOf('administrative_area_level_1') > -1)
  //         state = address[i].short_name;
  //
  //     }
  //
  //     if (this.checkResultsFound(city, state))
  //       return new LocationModel(this.position, city, state);
  //
  //     else
  //       return 'Cidade ou estado não encontrado';
  //
  //   } else
  //     return 'Erro';
  //
  //
  // }

  private checkResultsFound(city: string, state: string) {
    return city != null && state != null;
  }

}
