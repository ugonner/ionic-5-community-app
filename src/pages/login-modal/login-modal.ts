import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the LoginModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModalPage {

  public Logindata = {
       email: '',
      password: ''
  };

  public displaypassword: boolean = false;
  public TinyMessage: String = '';
  public loginform: boolean = true;
  public CanLeave: any =  false;
  public PushId: any;

  public DisplaySpinner: boolean;
  public LoadingMessage: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider,
                private storage: Storage, private utilityservice: UtilityservicesProvider, private app: App, private viewCtrl: ViewController) {
  }

  public groups: any = {
      "grouplevel1s": [{"id": '', "name": '', "description":''}],
      "grouplevel2s": [{"id": '', "name": '', "description":'', "grouplevel1id": ''}],
      "grouplevel3s": [{"id": '', "name": '', "description":'', "grouplevel1id": '', "grouplevel2id": ''}]
  };

  ionViewDidEnter() {
    let groups = this.storage.get("groups").then((grp)=>{
        if(grp){
            this.groups = grp;
            this.utilityservice.presentLoading("saw groups");
        }else{
            let postdata = {"getgroups":"true"};
            this.httpservice.postStuff("/api/group/",postdata)
                .subscribe((data)=>{
                    if(data.results == "0"){
                        this.utilityservice.presentToast(data.message,1);
                    }else{
                        this.groups = data.results;
                        this.storage.set("groups",data.results).then((datastored)=>{
                            this.utilityservice.presentToast("groups stored",2);
                        }).catch((storegrperr)=>{
                            this.utilityservice.presentToast(storegrperr.message,1);
                        })
                    }

                },(err)=>{
                    this.utilityservice.presentLoading(err.message+"err");
                })
        }
    }).catch((err)=>{

    });
    console.log('ionViewDidLoad LoginModalPage');
  }


  /*ionViewCanLeave(){
     return this.CanLeave;
  }*/

  toggleForms(){
      this.loginform = !(this.loginform);
      console.log(this.loginform + ' abi');
  }


  presentLoading(str){
      this.DisplaySpinner = true;
      this.LoadingMessage = str;
  }

  dismissLoad(){
      this.DisplaySpinner = false;
  }


  loginUser(){
      let postdata: any;
      if(this.Logindata.email == '' || this.Logindata.password == ''){
          this.TinyMessage = "you can not submit an empty value";
          return false
      }else{
          postdata = {
              "log": 'login',
              "login":'yes',
              email: this.Logindata.email,
              password: this.Logindata.password
          };

          if(this.PushId == null || this.PushId == 'undefined'){
              console.log('no pushid or token');
          }else{
              postdata.pushid = this.PushId;
          }

          /*this.TinyMessage = JSON.stringify(postdata);*/

          //this.utilityservice.presentLoading("loggin details, please wait");
          this.httpservice.postStuff("/api/user/index.php",
                  JSON.stringify(postdata))
                      .subscribe((data)=>{
                  if(data.results == "0"){
                      this.TinyMessage = data.message + " got it";
                      console.log("got there");
                  }else{
                      let userdata = data.results;
                      this.storage.set("ihiteappuserdata",userdata)
                          .then(dat=>{
                              this.CanLeave = true;
                              //this.viewCtrl.dismiss();
                              this.navCtrl.push("AboutPage");
                              //this.nav.setRoot(WelcomePage);
                              /*let app = this.app.getRootNav();
                              app.push("WelcomePage");*/
                              console.log(data.results.firstname + " " + " data stored");
                          }).catch(err=>{
                              console.log(err);
                          });
                      console.log(data.message+' ' + data.results+' ' + data + ' got to server with result');
                  }
              },(err)=>{
                  this.TinyMessage = ' Error In Requsest';
                  this.utilityservice.presentLoading(err.message+" loggin details, please wait");
                  console.log(err + 'error in request');
              });
          this.dismissLoad();
          return true;
      }
  }

    public  Regdata = {"register":'reg', "email": '', "password": '', "firstname": '', "surname": '',
        "mobile": '', "public": '', "locationid": '', "sublocationid": '',"grouplevel1id":'',"grouplevel2id":'',"grouplevel3id":'',"pushid":''};
    public Regdatamsg = {"email": '', "password": '', "mobile": '', "surname":'', "firstname": '', "public": ''
        , "locationid": '', "sublocationid": '',"grouplevel1id":'',"grouplevel2id":'',"grouplevel3id":'',"pushid":''};

    public RegdataString = JSON.stringify(this.Regdata);
    registerUser(){
      if((this.Regdata.email == '') || (this.Regdata.password == '') || (this.Regdata.mobile == '')
          || (this.Regdata.firstname == '')|| (this.Regdata.grouplevel1id == '') || (this.Regdata.grouplevel2id == '') || (this.Regdata.grouplevel3id == '')){
          this.TinyMessage = " All fields are required";
          this.utilityservice.presentToast(this.TinyMessage,2);
      }
      else{
          if(this.PushId == null || this.PushId == 'undefined'){
              console.log('ok');
          }else{
              this.Regdata.pushid = this.PushId;
          }
        //this.utilityservice.presentLoading("Uploading and Verifying Your Detail, Please Wait A Second");
        this.httpservice.postStuff("/api/user/index2.php",this.Regdata)
              .subscribe((res)=>{
               /*alert(res["_body"]);*/
                  if(res.results == "0" || res.results == ''){
                      this.TinyMessage = res.message;
                      console.log("registration failed" + res +' '+ res.message);
                      this.utilityservice.presentToast(res.message,2);
                  }else{
                      let userdata = res.results;
                      this.storage.set("ihiteappuserdata", userdata)
                          .then(()=>{
                              this.CanLeave = true;
                              this.viewCtrl.dismiss();
                              this.navCtrl.push("WelcomePage");
                              /*let app = this.app.getRootNav();
                              app.push("WelcomePage");*/
                              this.TinyMessage = this.Regdata.firstname+", you have been registered successfully ";
                              console.log(this.Regdata.firstname + 'successfully saved to memory');})
                          .catch(err=>{
                              this.TinyMessage = 'Unable to get user data from device storage';
                              console.log(err);
                          });
                  }
              }, (err)=>{

                this.TinyMessage = err.message+'  Error in connection for request, try again';
                this.utilityservice.presentLoading(this.TinyMessage);
                console.log(err);
            });
       this.dismissLoad();
      }
  }
}
