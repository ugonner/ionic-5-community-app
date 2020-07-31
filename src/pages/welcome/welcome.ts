import { Component } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';
import { NativeAudio } from '@ionic-native/native-audio';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

    private Law: Array<any>;
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private storage: Storage, private utilityserservice: UtilityservicesProvider, public nativeAudio: NativeAudio) {
      /*this.platform.ready().then((ready)=>{
          this.nativeAudio.preloadSimple("id1","assets/audio/bite.mp3").then((loaded)=>{
              console.log("got preloaded");
          },(err)=>{
              this.utilityserservice.presentToast(err,2);
          });
          this.nativeAudio.preloadSimple("id2","assets/audio/splat.mp3").then((loaded)=>{},(err)=>{});
      },(err)=>{
          console.log("error in platform");
      })*/
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WelcomePage');
    }

    ionViewDidEnter() {
        //this.resetAppParameters();
        this.updateAppParameters();
    }


    //public Groups: any = {"grouplevel1s": []};
    //public Roles;
    //public Categories;
    //public Clusters;

    updateAppParameters(){
        this.setGroups();
        this.setRoles();
        this.setCategories();
        this.setClusters();
    }

    resetAppParameters(){
        this.utilityserservice.resetGroups();
        this.utilityserservice.resetCategories();
        this.utilityserservice.resetClusters();
        this.utilityserservice.resetRoles();
    }


    LangCode: any;

    updateLangCode(){
        //set language
        this.storage.get("LangCode")
            .then((langcode)=>{
                this.LangCode = langcode;
                //this.utilityservice.presentToast('get stored date'+this.LangCode,1);
            }).catch((err)=>{
                //this.utilityservice.presentToast('unable to get stored date',1);
            });
    }



    public Groups: any = {
        "grouplevel1s": [{"id": '', "name": '', "description":''}],
        "grouplevel2s": [{"id": '', "name": '', "description":'', "grouplevel1id": ''}],
        "grouplevel3s": [{"id": '', "name": '', "description":'', "grouplevel1id": '', "grouplevel2id": ''}]
    };

    public Group1s: any = [{"id": '', "name": '', "description":'', "grouplevel2s": [{"id": '', "name": '', "description":'', "grouplevel3s": [{"id": '', "name": '', "description":'', "grouplevel1id": '', "grouplevel2id": ''}]}]}];
    public Group2s: any = [{"id": '', "name": '', "description":'', "grouplevel3s": [{"id": '', "name": '', "description":'', "grouplevel1id": '', "grouplevel2id": ''}]}];
    public Group3s: any = [{"id": '', "name": '', "description":'', "grouplevel1id": '', "grouplevel2id": ''}];

    setGroups() :any {
        //var grps: any = {};
        let groups = this.storage.get("groups").then((grp)=>{
            if(grp){

                //creating subgroups for group 1;;
                let thisGroup3s = grp.grouplevel3s;
                let thisGroup2s = grp.grouplevel2s;
                let thisGroup1s = grp.grouplevel1s;
                let grp3len = thisGroup3s.length;
                let grp2len = thisGroup2s.length;
                let grp1len = thisGroup1s.length;

                for(let grp2=0; grp2< grp2len; grp2++){
                    thisGroup2s[grp2].grouplevel3s = [];
                    for(let grp3=0; grp3< grp3len; grp3++){
                        if(thisGroup3s[grp3].grouplevel2id == thisGroup2s[grp2].id){
                            thisGroup2s[grp2].grouplevel3s.push(thisGroup3s[grp3]);
                        }
                    }
                }
                this.Group2s = thisGroup2s;
               // this.utilityserservice.presentLoading(this.Group2s[0].grouplevel3s[0].name + " this.Group2s grp3 major");

                for(let grp1=0; grp1< thisGroup1s.length; grp1++){
                    thisGroup1s[grp1].grouplevel2s = [];
                    for(let grp2=0; grp2< thisGroup2s.length; grp2++){
                        if(thisGroup2s[grp2].grouplevel1id == thisGroup1s[grp1].id){
                            thisGroup1s[grp1].grouplevel2s.push(thisGroup2s[grp2]);
                        }
                    }
                }

                this.Group1s = thisGroup1s;
                //end of sorting grouups
                //let mappedgrps = new Map(Object.entries(grp));
                this.Groups = grp;
                this.presentLoading("ya did sort saw groups like film"+ this.Groups.grouplevel1s[0].name);
                return grp;
            }else{
                let postdata = {"getgroups":"true"};
                this.httpservice.postStuff("/api/group/",postdata)
                    .subscribe((data)=>{
                        let groups2 = data.results;
                        if(groups2 == "0"){
                            this.presentToast(data.message,1);
                        }else{

                            //creating subgroups for group 1;;
                            let thisGroup3s = groups2.grouplevel3s;
                            let thisGroup2s = groups2.grouplevel2s;
                            let thisGroup1s = groups2.grouplevel1s;
                            let grp3len = thisGroup3s.length;
                            let grp2len = thisGroup2s.length;
                            let grp1len = thisGroup1s.length;

                            for(let grp2=0; grp2< grp2len; grp2++){
                                thisGroup2s[grp2].grouplevel3s = [];
                                for(let grp3=0; grp3< grp3len; grp3++){
                                    if(thisGroup3s[grp3].grouplevel2id == thisGroup2s[grp2].id){
                                        thisGroup2s[grp2].grouplevel3s.push(thisGroup3s[grp3]);
                                    }
                                }
                            }
                            this.Group2s = thisGroup2s;
                            //this.utilityserservice.presentLoading(this.Group2s[0].grouplevel3s[0].name + " this.Group2s grp3 major");

                            for(let grp1=0; grp1< thisGroup1s.length; grp1++){
                                thisGroup1s[grp1].grouplevel2s = [];
                                for(let grp2=0; grp2< thisGroup2s.length; grp2++){
                                    if(thisGroup2s[grp2].grouplevel1id == thisGroup1s[grp1].id){
                                        thisGroup1s[grp1].grouplevel2s.push(thisGroup2s[grp2]);
                                    }
                                }
                            }

                            this.Group1s = thisGroup1s;
                            //end of sorting grouups

                            this.Groups = groups2;
                            //this.groups = groups;
                            this.storage.set("groups",groups2).then((datastored)=>{
                                this.presentToast("groups stored",1);
                            }).catch((storegrperr)=>{
                                this.presentToast(storegrperr.message,1);
                            });
                            return groups2;
                        }

                    },(err)=>{
                        this.presentLoading(err.message+"err");
                    })
            }
        }).catch((err)=>{
            this.presentLoading(err);
        });

    }


    private Roles: any = [{"id": '', "name": ''}];
    setRoles() {
        let roles = this.storage.get("roles").then((rls)=>{
            if(rls){
                this.Roles = rls;
                this.presentLoading("rolws got"+rls[0].name);
                return rls;
            }else{
                let postdata = {"getroles":"true"};
                this.httpservice.postStuff("/api/user/index2.php",postdata)
                    .subscribe((data)=>{
                        if(data.results == "0"){
                            this.presentToast(data.message+": restart app to try again ",1);
                        }else{
                            let roles2 = data.results;
                            this.Roles = roles2;
                            this.storage.set("roles",roles2).then((datastored)=>{
                                this.presentLoading("roles stored");
                            }).catch((storegrperr)=>{
                                this.presentToast(storegrperr.message,1);
                            });
                            return roles2;
                        }

                    },(err)=>{
                        this.presentLoading(err.message+"touch screen to dismiss");
                    })
            }
        }).catch((err)=>{

        });

    }


    public Categories: any = [{"id": '', "name": ''}];
    setCategories() {
        let categories = this.storage.get("categories").then((cats)=>{
            if(cats){
                this.Categories = cats;
                this.presentLoading("saw categories "+cats[0].name);
                return true;
            }else{
                let postdata = {"getcategories":"true"};
                this.httpservice.postStuff("/api/article/index2.php",postdata)
                    .subscribe((data)=>{
                        if(data.results == "0"){
                            this.presentToast(data.message+" no categories found, you may want to restart app again",1);
                        }else{
                            let categories2 = data.results;
                            this.Categories = categories2;
                            this.storage.set("categories",categories2).then((datastored)=>{
                                this.presentToast("categores stored",2);
                            }).catch((storegrperr)=>{
                                this.presentToast(storegrperr.message,1);
                            });
                            return true;
                        }

                    },(err)=>{
                        this.presentLoading(err.message+"internet error for categories, touch screen to dismiss");
                    })
            }
        }).catch((err)=>{

        });

    }

    public Clusters: any = [{"id": '', "name": ''}];
    setClusters() {
        let clusters = this.storage.get("clusters").then((cats)=>{
            if(cats){
                this.Clusters = cats;
                this.presentLoading("saw clusters "+cats[0].name);
                return cats;
            }else{
                let postdata = {"getclusters":"true"};
                this.httpservice.postStuff("/api/cluster/index.php",postdata)
                    .subscribe((data)=>{
                        if(data.results == "0"){
                            this.presentToast(data.message+" no clusters found, you may want to restart app again",1);
                        }else{
                            let categories2 = data.results;
                            this.Clusters = categories2;
                            this.storage.set("clusters",categories2).then((datastored)=>{
                                this.presentToast("categores stored",2);
                            }).catch((storegrperr)=>{
                                this.presentToast(storegrperr.message,1);
                            });
                            return categories2;
                        }

                    },(err)=>{
                        this.presentLoading(err+" internet error for categories, touch screen to dismiss");
                    })
            }
        }).catch((err)=>{

        });
    }

    public SearchedUsers: any = {
        "users": [{
            "id": 1,
            "firstname": '',
            "surname": '',
            "profilepic": '',
            "grouplevel1name": ''
        }],
        "message":'',
        "loadingState": true
    };

    public sus;
    public showSearchResults: boolean = false;

    searchUser(event){
        let searchElement = event.target;
        let value = event.target.value;
        //alert(value);
        if(value != '' || value.trim() != ''){
            this.SearchedUsers.loadingState = false;
            let postdata = {
                "searchuser": true,
                "uservalue": value
            };

            this.sus = this.httpservice.postStuff("/api/user/index2.php", postdata)
                .subscribe((data)=>{
                    //alert(data["_body"]);
                    if(data.results == "0"){
                        this.SearchedUsers.loadingState = false;
                        this.SearchedUsers.message = data.message;
                        this.showSearchResults = false;

                        this.utilityserservice.presentLoading(data.message);
                    }else{
                        this.SearchedUsers.users = data.results;
                        this.SearchedUsers.message = data.message;
                        this.SearchedUsers.loadingState = false;
                        this.showSearchResults = true;
                        //this.utilityserservice.presentLoading(this.SearchedUsers.users[0].firstname+ "got it");
                    }
                },(err)=>{
                    this.SearchedUsers.loadingState = false;
                    this.SearchedUsers.message = 'bad network: please try again';
                    this.utilityserservice.presentToast(err+": "+this.SearchedUsers.message,1);
                })
        }
    }

    private displaySection = 4;
    showGroup2sDiv(id){
        document.getElementById(id).style.display= "block";
    }
    hideGroup2sDiv(id){
        document.getElementById(id).style.display= "none";
    }

    private showSearchBox: boolean = true;
    toggleshowSearchBox(){
        this.showSearchBox = !this.showSearchBox;
    }
    presentLoading(msg){
        this.utilityserservice.presentLoading(msg);
    }
    presentToast(msg,duration){
        this.utilityserservice.presentToast(msg,1);
    }


    pushPageWithParameters(PageString , Params: any){
        /*this.nativeAudio.play("id1").then((played)=>{
            console.log("played");
        },(err)=>{
            this.utilityserservice.presentToast(err,1);
        });*/
        this.utilityserservice.playSound(2);
        this.navCtrl.push(PageString,Params);
    }

    pushPage(page){
        this.navCtrl.push(page);
    }




}
