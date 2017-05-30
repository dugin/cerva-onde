import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Diagnostic} from '@ionic-native/diagnostic';
import {Observable} from 'rxjs';
/*
 Generated class for the Facebook provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class DiagnosticService {


  constructor(private diagnostic: Diagnostic) {

  }


  locationEnabled() {

    return new Observable<boolean>(observer => {

      this.diagnostic.isLocationAuthorized()
        .then((isAuth) => {
          observer.next(isAuth);

        })
        .catch((err) => observer.error(err))

    })
  }
}
