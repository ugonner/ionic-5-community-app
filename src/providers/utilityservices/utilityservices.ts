import { Injectable } from '@angular/core';
import { Platform,MenuController,NavController, NavParams ,ToastController,LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeAudio } from '@ionic-native/native-audio';
import { HttpserviceProvider } from '../httpservice/httpservice';

/*
  Generated class for the UtilityservicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilityservicesProvider {

  constructor(public platform: Platform, public httpservice: HttpserviceProvider, public toastCtrl: ToastController, public navCtrl: MenuController,
               private menuCtrl: MenuController, public storage: Storage, private loadingCtrl: LoadingController,
               public nativeAudio: NativeAudio) {
      this.platform.ready().then((ready)=>{
          this.nativeAudio.preloadSimple("id1","assets/audio/Bite.mp3").then((loaded)=>{
              console.log("got preloaded");
          },(err)=>{
              this.presentToast(err,2);
          });

          //preload second sound;
          this.nativeAudio.preloadSimple("id2","assets/audio/Splat.mp3").then((loaded)=>{
              console.log("loaded second sound");
          },(err)=>{
              this.presentToast("Second Sound Not Loaded "+err,1);
          });
      },(err)=>{
          console.log("error in platform");
      });
    console.log('Hello UtilityservicesProvider Provider');
  }


    public groups: any = {
        "grouplevel1s": [{"id": '', "name": '', "description":''}],
        "grouplevel2s": [{"id": '', "name": '', "description":'', "grouplevel1id": ''}],
        "grouplevel3s": [{"id": '', "name": '', "description":'', "grouplevel1id": '', "grouplevel2id": ''}]
    };


    resetGroups(){
        let postdata = {"getgroups":"true"};
        this.httpservice.postStuffRawOutput("/api/group/",postdata)
            .subscribe((data)=>{
                if(data.results == "0"){
                    this.presentToast("No groups reset "+data.message,1);
                }else{
                    this.storage.set("groups",data.results).then((datastored)=>{
                        this.presentLoading("reset groups stored ");
                    }).catch((storegrperr)=>{
                        this.presentToast(storegrperr.message,1);
                    });
                }

            },(err)=>{
                this.presentLoading(err.message+"err");
            })
    }


    resetRoles(){
        let postdata = {"getroles":"true"};
        this.httpservice.postStuff("/api/user/index2.php",postdata)
            .subscribe((data)=>{
                if(data.results == "0"){
                    this.presentToast(data.message+": restart app to try again ",1);
                }else{
                    let roles2 = data.results;
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

    setGroups() :any {
        //var grps: any = {};
        let groups = this.storage.get("groups").then((grp)=>{
            if(grp){
                //grps = grp;
                this.groups = grp;
                this.presentLoading("saw groups like film"+ this.groups.grouplevel1s[0].name);
                return grp;
            }else{
                let postdata = {"getgroups":"true"};
                this.httpservice.postStuff("/api/group/",postdata)
                    .subscribe((data)=>{
                        let groups2 = data.results;
                        if(groups2 == "0"){
                            this.presentToast(data.message,1);
                        }else{
                            this.groups = groups2;
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
                this.presentLoading(rls[0].name);
                return rls;
            }else{
                let postdata = {"getroles":"true"};
                this.httpservice.postStuff("/api/user/index2.php",postdata)
                    .subscribe((data)=>{
                        if(data.results == "0"){
                            this.presentToast(data.message+": restart app to try again ",1);
                        }else{
                            let roles2 = data.results;
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
                return cats;
            }else{
                let postdata = {"getcategories":"true"};
                this.httpservice.postStuffRawOutput("/api/article/index2.php",postdata)
                    .subscribe((data)=>{
                        //this.presentLoading(data);
                        //alert(data.text);
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
                            return categories2;
                        }

                    },(err)=>{
                        this.presentLoading(err.message+"internet error for reset categories, touch screen to dismiss");
                    })
            }
        }).catch((err)=>{

        });

    }

    resetCategories(){
        let postdata = {"getcategories":"true"};
        this.httpservice.postStuffRawOutput("/api/article/index2.php",postdata)
            .subscribe((data)=>{
                //this.presentLoading(data);
                //alert(data["_body"]);
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
                    return categories2;
                }

            },(err)=>{
                this.presentLoading(err.message+"internet error for reset categories, touch screen to dismiss");
            })
    }

    public Clusters: any = [{"id": '', "name": ''}];
    setClusters() {
        let clusters = this.storage.get("clusters").then((cats)=>{
            if(cats){
                this.Categories = cats;
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
                            //this.Categories = categories2;
                            this.storage.set("categories",categories2).then((datastored)=>{
                                this.presentToast("categores stored",2);
                            }).catch((storegrperr)=>{
                                this.presentToast(storegrperr.message,1);
                            });
                            return categories2;
                        }

                    },(err)=>{
                        this.presentLoading(err+" internet error for clusters, touch screen to dismiss");
                    })
            }
        }).catch((err)=>{

        });
    }


    resetClusters(){
        {
            let postdata = {"getclusters":"true"};
            this.httpservice.postStuff("/api/cluster/index.php",postdata)
                .subscribe((data)=>{
                    if(data.results == "0"){
                        this.presentToast(data.message+" no clusters found, you may want to restart app again",1);
                    }else{
                        let categories2 = data.results;
                        //this.Categories = categories2;
                        this.storage.set("clusters",categories2).then((datastored)=>{
                            this.presentToast("clusterss stored",2);
                        }).catch((storegrperr)=>{
                            this.presentToast(storegrperr.message,1);
                        });
                        return categories2;
                    }

                },(err)=>{
                    this.presentLoading(err+" internet error for clusters, touch screen to dismiss");
                })
        }
    }
    presentToast(message, duration){
        let timer: any;
        if(duration == 1){
            timer = 4000;
        }else if(duration == 2){
            timer = 10000;
        }else{
            timer = duration;
        }
        let toast = this.toastCtrl.create({
            "message":message,
            "position":"middle",
            "duration": timer
        });
        toast.present();

    }

    playSound(SoundNumber){
        this.nativeAudio.play("id"+SoundNumber).then((playing)=>{
            console.log("playing");
        },(err)=>{
            this.presentToast("sound not played "+err,1);
        })
    }
    presentLoading(message): Loading{
        let loader = this.loadingCtrl.create({
            "content": message,
            "showBackdrop": true,
            "enableBackdropDismiss": true,
            "dismissOnPageChange": true
        });
        loader.present();
        return loader;
    }

    dismissLoader(loader: Loading){
        loader.dismiss()
    }

    echoTextInTranslation(paragraphobject: any, langcode){
        if(langcode == "1"){
            return paragraphobject.paragraphtext;
        }else if(langcode == "2"){
            //return JSON.parse(paragraphobject.paragraphigbotext);
            return paragraphobject.paragraphigbotext;
        }else if(langcode == "3"){
            //return JSON.parse(paragraphobject.paragraphannotation);
            return paragraphobject.paragraphannotation;
        }else{
            //return JSON.parse(paragraphobject.paragraphigbotext);
            return paragraphobject.paragraphigbotext;
        }
    }

    /*echoTextInTranslation(paragraphobject: any){
        this.storage.get("LangCode")
            .then((langcode)=>{
                if(langcode == 1){
                    return paragraphobject.paragraphtext;
                }else if(langcode == 2){
                    return paragraphobject.paragraphigbotext;
                }else if(langcode == 3){
                    return paragraphobject.paragraphannotation;
                }else{
                    return paragraphobject.paragraphigbotext;
                }
            }).catch((err)=>{
                this.presentToast('unable to get stored date',1);
                return paragraphobject.paragraphigbotext;
            })
    }*/
    /*pushPageWithParams(PageString: string , Params: any){
        this.menuCtrl.getOpen().close();
        let nCtrl = new NavController();
        nCtrl.push(PageString,Params);
    }*/

    /*pushPage(page: string, parameters: any){
        this.navCtrl.push(page,parameters);
    }*/
}
