import { ProfilePage } from './../profile/profile';
import { SuggestPage } from './../suggest/suggest';
import { BarsPage } from './../bars/bars.page';
import { Component } from '@angular/core';
import {Keyboard} from '@ionic-native/keyboard';

@Component({
  selector: 'ib-page-tabs',
  templateUrl: 'tabs.page.html',
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = BarsPage;
  tab2Root: any = SuggestPage;
  tab3Root: any = ProfilePage;
  valueforngif=true;


  constructor(private keyboard: Keyboard) {

    keyboard.onKeyboardShow().subscribe(()=>{this.valueforngif=false})
    keyboard.onKeyboardHide().subscribe(()=>{this.valueforngif=true})

  }
}
