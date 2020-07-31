import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpservice: HttpserviceProvider, public utilityservice: UtilityservicesProvider) {
  }

  public Users:  any = [
      {
          "id": 1,
          "firstname": '',
          "surname": '',
          "profilepic": '',
          "rolename": '',
          "rolenote": '',
          "grouplevel1name": '',
          "grouplevel2name": '',
          "grouplevel3name": ''
      }
  ];

  private Property_alias: any;
  private Property: any;
    private Value: any;
    private user_noofpages: any;
  private pageListArray: Array<any> = [];

  ionViewDidLoad() {
      this.Property = this.navParams.get("property");
      this.Property_alias = this.navParams.get("property_alias");
      this.Value = this.navParams.get("value");
      let value = this.navParams.get("value");

      this.getUsers(this.Property,this.Property_alias,value,0);
      console.log('ionViewDidLoad UsersPage');
  }

  getUsers(property, property_alias, value, pgn){
      let postdata = {
          "gubp": true,
          "property": property,
          "value": value,
          "property-alias": property_alias,
          "pgn": pgn
      };
      this.httpservice.postStuff("/api/user/index2.php",postdata)
          .subscribe((data)=>{
              let users_result = data.results;
              if(users_result == "0"){
                  this.utilityservice.presentLoading(data.message);
              }else{
                  this.Users = users_result;
                  this.user_noofpages = data.noofpages;
                  if(this.pageListArray.length < 1){
                      for(let i=0; i>data.noofpages; i++){
                          this.pageListArray.push(i);
                      }
                  }
                  this.utilityservice.presentLoading(data.message);
              }
          },(err)=>{
              this.utilityservice.presentLoading(err);
          });
  }


    pushPageWithParameters(PageString , Params: any){

        this.utilityservice.playSound(2);
        this.navCtrl.push(PageString,Params);
    }
}
