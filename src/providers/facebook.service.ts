import {Facebook} from '@ionic-native/facebook';
import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {FirebaseService} from './firebase.service';
import {UserModel} from '../model/user';
/*
 Generated class for the Facebook provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FacebookService {

  permissions = ['public_profile', 'email', 'user_friends'];
  userID: string;
  user: UserModel;

  constructor(private fb: Facebook,
              private firebaseService: FirebaseService) {
    console.log('Hello FacebookProvider Provider');
  }

  isLoggedIn(): Observable<any> {

    return new Observable<any>((obs) => {

      this.fb.getLoginStatus()
        .then((done) => {
          obs.next(done);
          obs.complete();

        })
        .catch((err) => {

          obs.error(err);
        });


    });


  }

  logOut(): Observable<any> {
    return new Observable<any>((obs) => {

      this.fb.logout()
        .then((done) => {
          obs.next(done);
          obs.complete();

        })
        .catch((err) => {
          obs.error(err);
        });


    });

  }

  logIn(): Observable<any> {

    return new Observable<any>((obs) => {

      this.fb.login(this.permissions)
        .then((done) => {

          obs.next(done);
          obs.complete();

        })
        .catch((err) => {

          obs.error(err);
        });


    });


  }

  getUserInfo() {

    return this.fb.api('/me?fields=id,name,email,gender,picture.type(large)', this.permissions)

  }


  onLogin() {

    return this.logIn()
      .mergeMap((fbResponse) => {

        return this.firebaseService.loginWithFacebook(fbResponse);

      }, 1)
      .map(data => {

        this.userID = data.uid
      })
      .retryWhen((e) => e.scan<number>((errorCount, err) => {
        if (errorCount >= 10) {
          throw err;
        }
        return errorCount + 1;
      }, 0).delay(1000))
      .mergeMap(() => this.getUserInfo())
      .mergeMap((user: any) => {

        user.photoURL = user.picture.data.url;
        delete user.picture;
        user.provider = 'facebook';

        this.user = user;

        return this.firebaseService.pushUser(user, this.userID);

      }, 1)

  }


}
