import {Injectable} from '@angular/core';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GeocoderService {


  /**
   * Geocoder.
   */
  geocoder: google.maps.Geocoder;

  constructor() {

    this.geocoder = new google.maps.Geocoder();

  }

  /**
   * Reverse geocoding by location.
   *
   * Wraps the Google Maps API geocoding service into an observable.
   *
   * @param latLng Location
   * @return An observable of GeocoderResult
   */
  geocode(latLng: number[]): Observable<google.maps.GeocoderResult[]> {

    return new Observable<google.maps.GeocoderResult[]>((observer: Observer<google.maps.GeocoderResult[]>) => {

      // Invokes geocode method of Google Maps API geocoding.
      this.geocoder.geocode({location: {lat: latLng[0], lng: latLng[1]}}, (

        // Results & status.
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {

          if (status === google.maps.GeocoderStatus.OK) {

            observer.next(results);
            observer.complete();

          } else {

            console.log('Geocoding service: geocoder failed due to: ' + status);

            observer.error(status);

          }

        })
      );

    });

  }

  /**
   * Geocoding services.
   *
   * Wraps the Google Maps API geocoding service into an observable.
   *
   * @param address The address to be searched
   * @return An observable of GeocoderResult
   */
  codeAddress(address: string): Observable<google.maps.GeocoderResult[]> {

    return new Observable<google.maps.GeocoderResult[]>((observer: Observer<google.maps.GeocoderResult[]>) => {

      // Invokes geocode method of Google Maps API geocoding.
      this.geocoder.geocode({address: address}, (

        // Results & status.
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {

          if (status === google.maps.GeocoderStatus.OK) {

            observer.next(results);
            observer.complete();

          } else {

            console.log('Geocoding service: geocode was not successful for the following reason: ' + status);

            observer.error(status);

          }

        })
      );

    });

  }

}
