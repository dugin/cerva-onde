import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from './../../providers/firebase.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the BarDetail provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BarDetailService {

  constructor(public firebaseService: FirebaseService) {
    console.log('Hello BarDetail Provider');
  }


  getBeer(id: string[]) {

    return new Observable<any[]>((observer: Observer<any>) => {

      const beers: any[] = [];      
     const subs =  Observable.from(id)
        .mergeMap(this.firebaseService.getBeerFromBar)
        .finally(() => {
          beers.sort((a: any, b: any) => {
            return a.price - b.price;
          });
          observer.next(beers);
          observer.complete()
        })
        .subscribe((data) => {
        
          beers.push(data);

          if(id.length == beers.length)
            subs.unsubscribe()
        },
        (error) => observer.error(error))

    })

  }

}
