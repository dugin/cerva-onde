import {Injectable} from '@angular/core';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import {Observable, Observer} from 'rxjs/Rx';
import {GeocoderService} from "./geocoder.service";
import {LocationModel} from "../model/location";

/*
 Generated class for the LocationProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class LocationService {

  position: number[];
  public static myLocation: LocationModel;

  constructor(public geocodingProvider: GeocoderService,
              public  geolocation: Geolocation) {
    console.log('Hello LocationProvider Provider');

  }

  public getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return  R * c; // Distance in km

  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  private getMyLatLon(): Observable<number[]> {

    return Observable.fromPromise(this.geolocation.getCurrentPosition({enableHighAccuracy: true}))
      .map((position) => {
        this.position = [position.coords.latitude, position.coords.longitude];
        return this.position;
      });

  }


  public getMyLocation(): Observable<LocationModel> {

    return new Observable((observer: Observer<LocationModel | string>) => {

      this.getMyLatLon()
        .mergeMap((latLng) => {
          return this.geocodingProvider.geocode(latLng);

        })

        .subscribe((results) => {

            observer.next(this.getMyLocationInfo(results));
            observer.complete();

          },
          (err) => observer.error(err))
      ;


    });


  }


  private getMyLocationInfo(results: google.maps.GeocoderResult[]): LocationModel | string {


    if (results[0]) {

      const address = results[0].address_components;
      let city;
      let state;
      let neighborhood;

      for (let i = 0; i < address.length; i++) {

        if (address[i].types.indexOf('locality') > -1)
          city = address[i].long_name;

        if (address[i].types.indexOf('administrative_area_level_1') > -1)
          state = address[i].short_name;

        if (address[i].types.indexOf('sublocality') > -1)
          neighborhood = address[i].short_name;

      }

      if (this.checkResultsFound(city, state)) {
        LocationService.myLocation = new LocationModel(this.position, city, state, neighborhood);
        return LocationService.myLocation;
      }

      else
        return 'Cidade ou estado não encontrado';

    } else
      return 'Erro';


  }

  private checkResultsFound(city: string, state: string) {
    return city != null && state != null;
  }

}
