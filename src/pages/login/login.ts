import {PermissionsPage} from './../permissions/permissions';
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FacebookService} from '../../providers/facebook.service';
import {FirebaseService} from '../../providers/firebase.service';
import {DiagnosticService} from '../../providers/diagnostic.service';
import {TabsPage} from '../tabs/tabs.page';
import {UserModel} from '../../model/user';

/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private facebookService: FacebookService,
              private diagnosticService: DiagnosticService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onSkip() {
    this.navCtrl.setRoot(PermissionsPage);
  }

  onLoginWithFacebook() {

    this.facebookService.onLogin()
      .mergeMap((data) => this.diagnosticService.locationEnabled())
      .subscribe(data => {

        if (typeof data === 'boolean')
          if (data)
            this.navCtrl.setRoot(TabsPage);
          else
            this.navCtrl.setRoot(PermissionsPage);


      })

  }

}
