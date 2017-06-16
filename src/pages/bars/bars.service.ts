import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {BarModel} from './../../model/bar';
import {FirebaseService} from './../../providers/firebase.service';
import {Injectable} from '@angular/core';
import {LocationService} from "../../providers/location.service";

@Injectable()
export class BarsService {

  bars = new Array<BarModel>();
  barCont = 0;


  constructor(public firebaseService: FirebaseService,
              public locationService: LocationService) {
  }

  getBars(latLng: number[], radius: number): Observable<BarModel[]> {

    console.log(latLng)

    return new Observable<BarModel[]>((observer: Observer<BarModel[]>) => {

      const subs = this.firebaseService.getBarsNearby(latLng, radius)
        .do((data) =>  this.bars.push(new BarModel(data.distance, data.key)))
        .mergeMap((data) => this.firebaseService.getBar(data.key))
        // .filter(bar => {
        //   if (!bar.type || bar.type !== -1)
        //     return true;
        //   else{
        //
        //   this.bars.pop();
        //     return false;
        //   }
        //
        // })
        .finally(() => {
          this.bars.sort((a: BarModel, b: BarModel) => {
            return a.distance - b.distance;
          });
          console.log('finally');
          observer.next(this.bars);
          observer.complete();

        })
        .subscribe((data) => {
            const dist = this.bars[this.barCont].distance;

            console.log(dist,  this.bars[this.barCont]);

            if (!data.type || data.type >= 0) {
              this.bars[this.barCont] = data;
              this.bars[this.barCont].distance = dist;
              this.barCont++;
            }
            else
              this.bars.splice(this.barCont, 1);



            if (this.barCont == this.bars.length)
              subs.unsubscribe();

          },
          (err) => {
            console.error(err);
            observer.error(err);
          }
        )

    })

  }

  getMyLocationInfo() {

    return this.locationService.getMyLocation();

  }
}
