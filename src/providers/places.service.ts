import { OpeningModel } from './../model/opening';
import { AddressModel } from './../model/address';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

declare var document: any;

@Injectable()
export class PlacesService {


    constructor() { }


    getPlaces(name: string, neighborhood: string, city: string): Observable<google.maps.places.PlaceResult[]> {

        const service = new google.maps.places.PlacesService(document.createElement('div'));

        return new Observable<any>((observer: Observer<google.maps.places.PlaceResult[]>) => {

            service.textSearch({ query: `${name}in${neighborhood}-${city}` },
                (results: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {

                        observer.next(results);
                        observer.complete();

                    } else {

                        console.log('Places service: places failed due to: ' + status);

                        observer.error(status);
                    }

                });
        });

    }

    getPlacesDetails(placeID: string) {

        const service = new google.maps.places.PlacesService(document.createElement('div'));

        return new Observable<google.maps.places.PlaceResult>((observer: Observer<google.maps.places.PlaceResult>) => {

            service.getDetails({ placeId: placeID },
                (result: google.maps.places.PlaceResult, status: google.maps.places.PlacesServiceStatus) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {

                        observer.next(result);
                        observer.complete();

                    } else {

                        console.log('Places service: places details failed due to: ' + status);

                        observer.error(status);

                    }

                });


        });
    }

    setAddress(place: google.maps.places.PlaceResult): AddressModel {

        const add = new AddressModel();

        place.address_components.forEach(address => {

            if (address.types.indexOf('locality') > -1)
                add.city = address.long_name;

            else if (address.types.indexOf('route') > -1)
                add.street = address.short_name;

            else if (address.types.indexOf('sublocality') > -1)
                add.neighborhood = address.long_name;

            else if (address.types.indexOf('administrative_area_level_1') > -1)
                add.state = address.short_name;

            else if (address.types.indexOf('street_number') > -1)
                add.number = Number.parseInt(address.long_name);

            else if (address.types.indexOf('country') > -1)
                add.country = address.long_name;

            else if (address.types.indexOf('postal_code') > -1)
                add.cep = address.long_name;

        });

        add.coordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };


        return add;


    }

    setOpeningHours(place: any): Array<OpeningModel> | null {

        if (place.opening_hours) {
            const arr: string[] = place.opening_hours.weekday_text;
            const openingHours = new Array<OpeningModel>();

            arr.forEach(value => {

                let open = value.substr(value.indexOf(':') + 2, 5);
                let close = value.substr(value.length - 5, 5);

                if (open.indexOf(':') === -1 && close.indexOf(':') === -1)
                    open = close = '';

                openingHours.push(new OpeningModel(open, close))
            });

            return openingHours;

        }

        return null;

    }

    setContact(place: google.maps.places.PlaceResult): string {
        return place.formatted_phone_number;
    }

    setPhotos(place: google.maps.places.PlaceResult, numOfPhotos: number): Array<string> | null {

        const arr = new Array<string>();

        if (place.photos) {
            for (let i = 0; i < place.photos.length; i++) {

                arr.push(place.photos[i].getUrl({ maxHeight: 200, maxWidth: 200 }));

                if (i === numOfPhotos - 1)
                    break;

            }

            return arr;
        }

        return null;
    }

    errorHandler(err: string) {
        
        switch (err) {
            case 'ZERO_RESULTS':
                return 'Nenhum bar encontrado';
            case 'UNKNOWN_ERROR':
                return 'Nenhum bar encontrado';
            case 'OVER_QUERY_LIMIT':
                return 'Nenhum bar encontrado';
            case 'INVALID_REQUEST':
                return 'Nenhum bar encontrado';
            case 'ERROR':
                return 'Sem conexão com a internet';
            default:
                break;
        }
    }


}
