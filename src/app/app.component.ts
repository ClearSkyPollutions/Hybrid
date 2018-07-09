import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;

  constructor(
    private platform         : Platform,
    private statusBar        : StatusBar,
    private splashScreen     : SplashScreen,
    private translate:  TranslateService,
    private storage     : Storage,
  ) {
    // check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial').then((hasSeenTutorial: boolean) => {
      if (hasSeenTutorial) {
        this.rootPage = 'TabsPage';
      } else {
        this.rootPage = 'SlidesPage';
      }
      this.platformReady();
    });
  }

  platformReady() :void {
    // Call any initial plugins when ready

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
    });
  }

  initTranslate() : void {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    this.translate.addLangs(['en', 'fr']);
    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }
  }




}
