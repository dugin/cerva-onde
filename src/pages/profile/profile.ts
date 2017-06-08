import {Component, NgZone} from '@angular/core';
import {AlertController, NavController, NavParams, Platform} from 'ionic-angular';
import {FacebookService} from '../../providers/facebook.service';
import {FirebaseService} from '../../providers/firebase.service';
import {Observable} from 'rxjs';
import {EmailComposer} from '@ionic-native/email-composer';
import {AppRate} from '@ionic-native/app-rate';

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
  isIOS;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public facebookService: FacebookService,
              private firebaseService: FirebaseService,
              private ngZone: NgZone,
              private platform: Platform,
              private emailComposer: EmailComposer,
              private appRate: AppRate,
              private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {

    this.emailComposer.isAvailable().then((available: boolean) => {
      console.log('emailComposer', available);

    });

    this.appRate.preferences = {
      storeAppURL: {
        ios: '781987951',
        android: 'market://details?id=com.Menaze.Cervaonde',
      },
      useLanguage: 'pt-br',
      displayAppName: 'Cervaonde'
    };


    this.isIOS = this.platform.is('ios');

    this.getUser();


    console.log('ionViewDidLoad ProfilePage');
  }

  talkToUs() {
    console.log('talkToUs');

    const email = {
      to: 'cervaonde@gmail.com',
      subject: 'Fale Conosco',
      body: ` Enviado através do app Cervaonde - ${this.isIOS ? 'IOS' : 'Android'}`,
      isHtml: true
    };

    this.emailComposer.open(email);

  }

  rateApp() {

    this.appRate.promptForRating(true);
  }

  reportProblem() {
    console.log('reportProblem');
    const email = {
      to: 'cervaonde@gmail.com',
      subject: 'Relatar um problema',
      body: ` Enviado através do app Cervaonde - ${this.isIOS ? 'IOS' : 'Android'}`,
      isHtml: true
    };

    this.emailComposer.open(email);

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

  onLoginWithFacebook() {
    this.facebookService.onLogin()
      .subscribe(user => {
        console.log(user);
      })
  }


  onLogOut() {

    this.promptLogOut();
  }

  private promptLogOut() {

    const alert = this.alertCtrl.create({
      title: 'Sair',
      message: 'Tem certeza que deseja sair do Facebook?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: () => {
            this.facebookService.logOut()
              .mergeMap(() => Observable.fromPromise(this.firebaseService.logOut()))
              .subscribe(success => {
                console.log('logOut: ' + success);

              })
          }
        }
      ]
    });
    alert.present();
  }



}
