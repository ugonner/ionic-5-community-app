
//i edited "libs: [es2015]" TO es2017 to support Object.entries() used in community.ts
import { Component,OnInit,  ViewChild } from '@angular/core';
import { Platform,Nav, MenuController, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TextToSpeech,TTSOptions } from '@ionic-native/text-to-speech';

import { HttpserviceProvider } from '../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../providers/utilityservices/utilityservices';


import { WelcomePage } from '../pages/welcome/welcome';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  rootPage:any = WelcomePage;
    @ViewChild("nav1") public nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private httpservice: HttpserviceProvider,
              private storage: Storage, private utilityservice: UtilityservicesProvider, public menuCtrl: MenuController,
              private alertCtrl: AlertController, private tts: TextToSpeech) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }

    ngOnInit() {

        //check for locally stored law
    }

    updateAppParameters(){
        this.utilityservice.resetCategories();
        this.utilityservice.resetGroups();
        this.utilityservice.resetClusters();
        this.utilityservice.resetRoles();
    }


    public noVerifiedUser: any = {
        "user": [{
            "id": 1,
            "firstname": 'NA',
            "surname": 'NA',
            "profilepic": '/api/img/users/user.jpg',
            "grouplevel1name": 'NA',
            "grouplevel2name": 'NA',
            "grouplevel3name": 'NA',
            "rolename": 'NA',
            "rolenote": 'NA'
        }],
        "message":'This Person Not A Verified Member',
        "verifyicon": 'close'
    };

    public VerifiedUser: any = {
        "user": [{
            "id": 1,
            "firstname": '',
            "surname": '',
            "profilepic": '/api/img/users/user.jpg',
            "grouplevel1name": '',
            "grouplevel2name": '',
            "grouplevel3name": '',
            "rolename": '',
            "rolenote": ''
        }],
        "message":'Enter New Social ID and Verify',
        "verifyicon": 'spinner',
        "loadingState": false,
        "verifybackground": 'gray'
    };

    //public sus;
    public showSearchResults: boolean = false;

    noVerifiedUserSocialWelfares: any = [{
        "clusterid": 1,
        "clustername": 'None'
    }];
    VerifiedUserSocialWelfares: any = [{
        "clusterid": 1,
        "clustername": 'None'
    }];

    showVerificationData: boolean = false;
    SocialId: any;
    verifyUser(){
        this.VerifiedUser.loadingState = false;
        let socialid = this.SocialId;
        this.getVerifiedUserSocialWelfares(socialid);
        this.searchUser(socialid);
        this.VerifiedUser.loadingState = true;
        this.VerifiedUser.verifyicon = 'checkmark';
        //this.showVerificationData = true;
        //this.getVerifiedUserSocialWelfares(socialid);
    }

    searchUser(socialid){
        //let value = socialid;
        //alert(value);
        if(socialid != '' || socialid.trim() != ''){
            let postdata = {
                "searchuser": true,
                "uservalue": socialid
            };
            this.VerifiedUser.verifyicon = "spinner";
            this.httpservice.postStuff("/api/user/index2.php", postdata)
                .subscribe((data)=>{
                    //alert(data["_body"]);
                    if(data.results == "0"){
                        this.showVerificationData = false;
                        this.VerifiedUser.message = 'Verification Failed: This Person Is Not A Verified Member';
                        this.tts.speak(this.VerifiedUser.message)
                            .then((spoke)=>{
                                console.log('spoke');
                            })
                            .catch((ttserr)=>{
                                console.log(ttserr);
                            });
                        this.VerifiedUser.verifyicon = "close";
                        this.VerifiedUser.verifybackground = "red";
                        this.utilityservice.presentToast(data.message,1);
                    }else{
                        this.VerifiedUser.user = data.results;
                        this.VerifiedUser.message = 'Verification Successful: This Person Is A Verified Member';
                        this.showVerificationData = true;
                        this.tts.speak(this.VerifiedUser.message)
                            .then((spoke)=>{
                                console.log('spoke');
                            })
                            .catch((ttserr)=>{
                                console.log(ttserr);
                            });
                        this.VerifiedUser.verifyicon = "checkmark";
                        this.VerifiedUser.verifybackground = "green";
                        this.showSearchResults = true;

                        //this.utilityservice.presentLoading(this.SearchedUsers.users[0].firstname+ "got it");
                    }
                },(err)=>{
                    this.VerifiedUser = this.noVerifiedUser;
                    this.VerifiedUser.message = 'bad network: please try again';
                    this.utilityservice.presentLoading(err.message+": "+this.VerifiedUser.message);
                })
        }
    }

    getVerifiedUserSocialWelfares(socialid){
        let postdata = {
            "getuserclusters": true,
            "userid": socialid
        };
        this.httpservice.postStuff("/api/cluster/index.php",postdata)
            .subscribe((data)=>{
                //alert(data["_body"]);
                if(data.results == "0"){
                    this.VerifiedUserSocialWelfares = this.noVerifiedUserSocialWelfares;
                    this.utilityservice.presentToast(data.message,1);
                }else{
                    this.VerifiedUserSocialWelfares = data.results;
                    //this.VerifiedUser.message = data.message;
                }
            },(err)=>{
                this.VerifiedUserSocialWelfares = this.noVerifiedUserSocialWelfares;
                this.utilityservice.presentLoading(err.message+ " bad network on welfares");
            })
    }

    private displaySearchUserDiv: boolean = false;
    toggleDisplaySearchUserDiv(){
        this.showVerificationData = false;
        this.displaySearchUserDiv = !this.displaySearchUserDiv;
    }

    pushPage(page){
        this.menuCtrl.getOpen().close();
        this.nav.push(page);
        this.utilityservice.playSound(1);
    }


    pushPageWithParameters(PageString: String , Params: any){
        this.menuCtrl.getOpen().close();

        this.nav.push(PageString,Params);
        this.utilityservice.playSound(2);
    }

    pushPageWithParametersOutsideMenu(PageString: String , Params: any){
        this.displaySearchUserDiv = false;
        this.nav.push(PageString,Params);
        this.utilityservice.playSound(2);
    }

    goHome(){
        this.utilityservice.playSound(1);
        this.menuCtrl.getOpen().close();
        this.nav.setRoot(WelcomePage);
    }

    goHomeOutsideMenu(){
        this.displaySearchUserDiv = false;
        this.utilityservice.playSound(2);
        this.nav.setRoot(WelcomePage);
    }

}

