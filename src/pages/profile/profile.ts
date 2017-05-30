import {Component, NgZone} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FacebookService} from '../../providers/facebook.service';
import {FirebaseService} from '../../providers/firebase.service';
import {Observable} from 'rxjs';

/*
 Generated class for the Profile page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  user;
  isLoggedIn = false;
  isLoading = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public facebookService: FacebookService,
              private firebaseService: FirebaseService,
              private ngZone: NgZone) {
  }

  ionViewDidLoad() {



      this.getUser();



    console.log('ionViewDidLoad ProfilePage');
  }

  getUser() {

    this.firebaseService.getLoggedUser()
      .mergeMap((value, index) => {

        console.log('getLoggedUser', value);

        if (value)
          return this.firebaseService.getUser(value.uid)

        return Observable.of(null);

      })
      .subscribe(user => {

        this.ngZone.run(() => {

          if (user)
            this.isLoggedIn = true;

          else
            this.isLoggedIn = false;

          this.isLoading = false;
          this.user = user;

        })
      })


  }

  onLoginWithFacebook(){
    this.facebookService.onLogin()
      .subscribe(user=>{
        console.log(user);
      })
  }


  onLogOut() {

    this.facebookService.logOut()
      .mergeMap(() => Observable.fromPromise(this.firebaseService.logOut()))
      .subscribe(success => {
        console.log('logOut: '+ success);

      })
  }

}
