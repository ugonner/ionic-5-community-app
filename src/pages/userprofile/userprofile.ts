import { Component,ViewChild, Renderer2, ElementRef } from '@angular/core';
/*
import { FormBuilder, FormGroup } from '@angular/forms';
*/
import { IonicPage,Platform, ToastController,  NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';
import { Storage } from '@ionic/storage';
import { File, FileEntry} from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject, FileUploadResult, FileTransferError} from '@ionic-native/file-transfer';
import { Camera, CameraOptions} from '@ionic-native/camera';

/**
 * Generated class for the UserprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html',
})
export class UserprofilePage{
    /*profilepicForm: FormGroup;*/
  constructor(public navCtrl: NavController, public navParams: NavParams,private utilityservice: UtilityservicesProvider, private httpservice: HttpserviceProvider,
      private storage: Storage, private toastCtrl: ToastController, private platform: Platform, private renderer: Renderer2,
      private transferer: FileTransfer, private camera: Camera, private actionCtrl: ActionSheetController,private file: File) {


      /*this.profilepicForm = this.formbuilder.group({
          "profilepicFile":[]
      });*/

  }
    @ViewChild('userprofilepicfile') private pic22: ElementRef;


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserprofilePage');
  }

  public userdata = new Map();
  public localuserdata = {"id": 0};
  public IsOwner: boolean = false;
  public ClassMessage: String;
  public UserLocations: any;
  public UserSublocations: any;
  public  lgaid;
  public DisplayEditForm: boolean = true;




  toggleDisplayEditForm(){
      this.DisplayEditForm = !this.DisplayEditForm;
  }
    public DisplayMakePastorForm: boolean = false;
    public Ministries: Array<any>;
    public MinistryId: any;
    public UserId: any;
    public StorageUserId: any;


    //using spinners as loading detectors;
    public LoadingMessage: string;
    public DisplaySpinner: boolean;

    presentLoading(str){
        this.DisplaySpinner = true;
        this.LoadingMessage = str;
    }

    dismissLoad(){
        this.DisplaySpinner = false;
    }

    presentToast(message, duration){
        let toast = this.toastCtrl.create({
            "message":message,
            "position":"middle",
            "duration": duration
        });
        toast.present();
    }


    displayMakePastorForm(){
        if(this.DisplayMakePastorForm== false){
            this.presentLoading("getting ministries for assignment, please wait");
            this.httpservice.postStuff("/api/ministry/index.php", JSON.stringify({getministries: "yes"}))
                .subscribe((data)=>{
                    this.dismissLoad();
                    if(data.results== "0"){
                        this.presentToast(data.message,5000);
                    }else{
                        this.Ministries = data.results;
                    }
                },(err)=>{
                    this.dismissLoad();
                    this.presentToast(" Bad Connection or response",5000);
                });
            this.DisplayMakePastorForm = true;
        }else{
            this.DisplayMakePastorForm = false;
        }
    }


    makePastor(userid){
        let postdata = {
            addPastor: "yes",
            userid: userid,
            ministryid: this.MinistryId
        };

        this.httpservice.postStuff("/api/pastor/index.php", JSON.stringify(postdata))
            .subscribe((data)=>{
                if(data.results== '0'){
                    this.presentToast(data.message,5000);
                }else{
                    this.presentToast(data.message,5000);
                }
            },(err)=>{
                this.presentToast(" Bad Connection or response",5000);
            })

    }






  ionViewDidEnter(){

      //this.pic.addEventListener('change',this.editUserProfilePic(userprofilepicfile.files[0]),false);
      this.storage.get("ihiteappuserdata")
          .then(data=>{
              this.localuserdata = data;
              let userid = this.navParams.get("userid");
              if(!userid){
                  //get user profile from user id from local storage;;
                      let postdata = JSON.stringify({
                          "getuser":'yes',
                          "uid":data.id
                      });

                  this.httpservice.postStuff("/api/user/index2.php", postdata)
                          .subscribe(res=>{
                              /*console.log("reached server "+ res["_body"]);*/
                              if(res.results == "0"){
                                  this.userdata.set("id" , data.id);
                                  this.userdata.set("email" , data.email);
                                  this.userdata.set("password" , data.password);
                                  this.userdata.set("firstname" , data.firstname);
                                  this.userdata.set("surname" , data.surname);
                                  this.userdata.set("mobile" , data.mobile);
                                  this.userdata.set("state" , data.state);
                                  this.userdata.set("lga" , data.lga);
                                  this.userdata.set("public" , data.public);
                                  this.userdata.set("roleid" , data.roleid);
                                  this.userdata.set("rolename" , data.rolename);
                                  this.userdata.set("rolenote" , data.rolenote);
                                  this.userdata.set("grouplevel1name" , data.grouplevel1name);
                                  this.userdata.set("grouplevel2name" , data.grouplevel2name);
                                  this.userdata.set("grouplevel3name" , data.grouplevel3name);
                                  this.userdata.set("profilepic" , this.httpservice.hostdomain +"/api/img/users/user.jpg");

                                  console.log("result o no data fetched " + res.message);
                              }else{
                                  this.userdata.set("id" , res.results.id);
                                  this.userdata.set("email" , res.results.email);
                                  this.userdata.set("password" , res.results.password);
                                  this.userdata.set("firstname" , res.results.firstname);
                                  this.userdata.set("surname" , res.results.surname);
                                  this.userdata.set("mobile" , res.results.mobile);
                                  this.userdata.set("locationname" , res.results.locationname);
                                  this.userdata.set("sublocationname" , res.results.sublocationname);
                                  this.userdata.set("LGAid" , res.results.LGAid);
                                  this.userdata.set("stateid" , res.results.stateid);
                                  this.userdata.set("public" , res.results.public);
                                  this.userdata.set("roleid" , res.results.roleid);
                                  this.userdata.set("rolename" , res.results.rolename);
                                  this.userdata.set("rolenote" , res.results.rolenote);
                                  this.userdata.set("grouplevel1name" , res.results.grouplevel1name);
                                  this.userdata.set("grouplevel2name" , res.results.grouplevel2name);
                                  this.userdata.set("grouplevel3name" , res.results.grouplevel3name);
                                  this.userdata.set("profilepic" , this.httpservice.hostdomain+res.results.profilepic);
                                  this.lgaid = res.results.sublocationid;
                                  console.log("data fetched successfully");
                                  console.log(this.localuserdata.id +" and plus  first"+ this.userdata.get("id"));

                                  //get userstates;
                                  let reqdata = JSON.stringify({"getlocations": 'yes', "lid": res.results.locationid});
                                  this.httpservice.postStuff("/api/location/index.php", reqdata)
                                      .subscribe(reqres=>{
                                          if(reqres.results == "0"){
                                              console.log(reqres.message + " did not got no states");
                                          }else{
                                              this.UserLocations = reqres.results;
                                              console.log(reqres.results[0].name + " "+reqres.message + " got the States");
                                          }
                                          /*console.log( reqres["_body"] + " get to server ");*/

                                      }, reqerr=>{
                                          console.log( reqerr + ' ' + reqerr["_body"] + " did not get to server ");

                                      });

                                  if(this.localuserdata.id == this.userdata.get("id")){
                                      this.IsOwner = true;
                                      //code for adding eventlistner


                                      if(this.IsOwner){
                                          //this.presentToast("ya isowner is ", 10000);
                                          //if(this.pic22){
                                              setTimeout(()=>{
                                                  this.renderer.listen(this.pic22.nativeElement, 'change', this.editUserProfilePic.bind(this));
                                              }, 2000);
                                          //}

                                      }
                                  }

                              }
                          }, (err)=>{
                              this.userdata.set("id" , data.id);
                              this.userdata.set("email" , data.email);
                              this.userdata.set("password" , data.password);
                              this.userdata.set("firstname" , data.firstname);
                              this.userdata.set("surname" , data.surname);
                              this.userdata.set("mobile" , data.mobile);
                          this.userdata.set("locationname" , data.locationname);
                          this.userdata.set("sublocationname" , data.sublocationname);
                              this.userdata.set("public" , data.public);
                              this.userdata.set("roleid" , data.roleid);
                          this.userdata.set("rolename" , data.rolename);
                          this.userdata.set("rolenote" , data.rolenote);
                          this.userdata.set("grouplevel1name" , data.grouplevel1name);
                          this.userdata.set("grouplevel2name" , data.grouplevel2name);
                          this.userdata.set("grouplevel3name" , data.grouplevel3name);
                              this.userdata.set("profilepic" , this.httpservice.hostdomain+"/api/img/users/user.jpg");

                              console.log(err + "data from server not fetched");

                          })
              }else{
                  //if param is set;
                  let postdata = JSON.stringify({"getuser":'yes',"uid":userid});
                  this.httpservice.postStuff("/api/user/index2.php", postdata)
                      .subscribe(res=>{
                          /*console.log("reached server "+ res["_body"] + ' ' +userid);*/
                          if(res.results == "0"){
                              this.ClassMessage = res.message;
                              console.log("no data fetched " + res.message);
                          }else{
                              this.userdata.set("id" , res.results.id);
                              this.userdata.set("email" , res.results.email);
                              this.userdata.set("password" , res.results.password);
                              this.userdata.set("firstname" , res.results.firstname);
                              this.userdata.set("surname" , res.results.surname);
                              this.userdata.set("mobile" , res.results.mobile);
                              this.userdata.set("locationname" , res.results.locationname);
                              this.userdata.set("sublocationname" , res.results.sublocationname);
                              this.userdata.set("public" , res.results.public);
                              this.userdata.set("roleid" , res.results.roleid);
                              this.userdata.set("rolename" , res.results.rolename);
                              this.userdata.set("rolenote" , res.results.rolenote);
                              this.userdata.set("grouplevel1name" , res.results.grouplevel1name);
                              this.userdata.set("grouplevel2name" , res.results.grouplevel2name);
                              this.userdata.set("grouplevel3name" , res.results.grouplevel3name);
                              this.userdata.set("profilepic" , this.httpservice.hostdomain+res.results.profilepic);


                              console.log("data fetched successfully");
                              console.log(this.localuserdata.id +" and plus  first"+ this.userdata.get("id"));
                              if(this.localuserdata.id == this.userdata.get("id")){
                                  this.IsOwner = true;
                              }

                          }
                      }, err=>{
                          console.log(err + "data from server not fetched");
                      })

              }
          }).catch((err)=>{
              this.presentToast("unable to get device data ",5000);
          });

      this.setGroups();
      //this.groups = this.utilityservice.groups;
      console.log(this.localuserdata.id +" and plus  "+ this.userdata.get("id"));

    }





    public groups: any = this.utilityservice.groups;

    setGroups(){
        let groups = this.storage.get("groups").then((grp)=>{
            if(grp){
                this.groups = grp;
            }else{
                let postdata = {"getgroups":"true"};
                this.httpservice.postStuff("/api/group/",postdata)
                    .subscribe((data)=>{
                        if(data.results == "0"){
                            this.presentToast(data.message,1);
                        }else{
                            let groups = data.results;
                            this.groups = groups;
                            this.storage.set("groups",groups).then((datastored)=>{
                                this.presentToast("groups stored",2);
                            }).catch((storegrperr)=>{
                                this.presentToast(storegrperr.message,1);
                            })
                        }
                    },(err)=>{
                        this.presentLoading(err.message+"err");
                    })
            }
        }).catch((err)=>{
            this.utilityservice.presentToast(err.message,1);
        });
    }


    editUserProfilePic(){
        try{

            //this.presentToast("change worked",10000);
            this.platform.ready().then((pltready)=>{
                //let newImageFile  = <HTMLInputElement>document.forms['imageForm']['userprofilepic'];

                //get and display selected image as a dataurl;
                let reader = new FileReader();
                reader.readAsDataURL(this.pic22.nativeElement.files[0]);
                //reader.readAsDataURL(newImageFile.files[0]);
                //reader.readAsDataURL(value);

                reader.onload = ()=>{
                    let newImageFile = reader.result;
                    this.userdata.set("profilepic", newImageFile);
                };
                //this.utilityservice.presentToast("ok  at xhttp",1);

                //diaplay spinner;
                this.DisplaySpinner = true;

                //create formdata object;
                //let form = <HTMLInputElement>document.forms['imageForm'];
                let form = <HTMLFormElement>document.forms.namedItem("imageForm");
                //let userid = this.userdata.get("id");
                let formdata = new FormData(form);
                //formdata.append('userprofilepic',form.files[0], "userpic");
                //formdata.append("userid", userid);
                //this.utilityservice.presentToast(formdata.userid+" plus "+userid+" and "+JSON.stringify(formdata),2);
                //create ajax call to send data;
                let xhttp = new XMLHttpRequest();
                xhttp.open("post", this.httpservice.hostdomain+"/api/user/userprofilepic/index.php",true);
                //on success trip to server;
                xhttp.onload= ()=>{
                    //this.utilityservice.presentToast(formdata.userid+"at server plus "+userid+" and "+JSON.stringify(formdata),2);
                    this.utilityservice.presentLoading(JSON.stringify(xhttp.responseText));
                    if(xhttp.status == 200){
                        this.DisplaySpinner = false;
                        this.utilityservice.presentLoading(JSON.stringify(xhttp.responseText));
                        this.presentToast( xhttp.responseText+" GOT SEERVER ",5000);
                    }else{
                        this.DisplaySpinner = false;
                        this.presentToast( "Bad Connection",3000);
                    }
                };
                //this.utilityservice.presentToast(formdata.userid+" plus "+userid+" and "+JSON.stringify(formdata),2);

                xhttp.send(formdata);
            }).catch((plterr)=>{
                this.presentToast(plterr+' platform error',15000);
            });

        }catch(err){
            this.presentToast( err+' try\'s catch error', 5000);
        }
    }


    selectCameraOptions(){
        let actionsheet = this.actionCtrl.create({
            subTitle: "SELECT IMAGE FROM",
            buttons:[
                {
                    text: "Take A Selfie",
                    handler: ()=>{
                        this.selectPictureFromCamera(1);
                    },
                    role: 'destructive'
                },
                {
                    text: "From Gallery",
                    handler: ()=>{
                        this.selectPictureFromCamera(2);
                    },
                    role: 'destructive'
                }
            ]
        });

        actionsheet.present();
    }

    selectPictureFromCamera(opt){
        this.platform.ready().then(()=>{
            let cameraoptions: CameraOptions ;
            if(opt == 1){
                cameraoptions = {
                    destinationType: this.camera.DestinationType.FILE_URI,
                    sourceType: this.camera.PictureSourceType.CAMERA,
                    mediaType: this.camera.MediaType.PICTURE,
                    allowEdit: true,
                    targetHeight: 300,
                    targetWidth: 400,
                    saveToPhotoAlbum: true,
                    cameraDirection: this.camera.Direction.FRONT
                };
            }else{
                cameraoptions = {
                    destinationType: this.camera.DestinationType.FILE_URI,
                    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: this.camera.MediaType.PICTURE,
                    allowEdit: true,
                    targetHeight: 300,
                    targetWidth: 400
                };
            }
            this.camera.getPicture(cameraoptions).then((picdata)=>{
                this.DisplaySpinner = true;
                this.file.resolveLocalFilesystemUrl(picdata)
                    .then((entry: FileEntry)=>{
                        entry.file((file)=>{this.uploadFile(file);},(err)=>{this.utilityservice.presentLoading(err);});
                        },(fentryerr)=>{})
                this.userdata.set("profilepic", picdata);

            },(rslverr)=>{
                this.utilityservice.presentLoading("file resolve error "+rslverr.message)
            })

        }).catch((err)=>{
            this.utilityservice.presentLoading(err.message)
        })
    }

    uploadFile(file){
            let filereader = new FileReader();
            filereader.onloadend = ()=>{
                let imgBlob = new Blob([filereader.result]);
                let formData = new FormData();
                formData.append("userid", this.userdata.get("id"));
                formData.append("userprofilepic",imgBlob,file.name);

                this.httpservice.http.post(this.httpservice.hostdomain+'/api/user/userprofilepic/',formData).map(res=>res.json())
                    .subscribe((data)=>{
                        if(data.results == "0"){
                            this.utilityservice.presentToast(data.message,1);
                        }else{
                            this.utilityservice.presentToast(data.message,1);
                        }
                    },(httperr)=>{
                        this.utilityservice.presentToast(httperr.message+": Internet error",1);
                    })
            };
        filereader.readAsArrayBuffer(file);
    }

    displayFilePicker(){
        //document.getElementById("userprofilepicfile").click();
       this.pic22.nativeElement.click();
    }

    public imagedata: any;



    editUser(property,value){

        let postdata = JSON.stringify({"edituser":'yes',"userid": this.localuserdata.id,"pty": property, "value": value});
        console.log(property + ' and value '+ value);
        this.utilityservice.presentLoading("Updating and saving your data, please wait a sec");
        this.httpservice.postStuff("/api/user/index2.php",postdata)
            .subscribe((res)=>{
                this.dismissLoad();
                /*console.log(res["_body"] + ' what is key');*/
                if(res.results == "0"){
                    this.ClassMessage = res.message;
                    this.utilityservice.presentLoading(this.ClassMessage);
                    console.log(res.message + 'not edited');
                }else{
                    this.ClassMessage = res.message;
                    this.userdata.set(property,value);
                    console.log(res.message + " successfully edited profile");
                }
            }, (err)=>{
                this.dismissLoad();
                this.ClassMessage = err.message;
                this.utilityservice.presentLoading(this.ClassMessage);
                console.log(err + " unable to get to server");
            });
    }

    getLgas(stateid){
        //get userstates;
        let reqdata = JSON.stringify({"getsublocations": 'yes', "lid": stateid});
        this.httpservice.postStuff("/api/location/index.php", reqdata)
            .subscribe(reqres=>{
                if(reqres.results == "0"){
                    console.log(reqres.message + " did not got no states");
                }else{
                    this.UserSublocations = reqres.results;
                    console.log(reqres.results[0].name + " "+reqres.message + " got the States");
                }
                /*console.log( reqres["_body"] + " get to server ");*/

            }, reqerr=>{
                console.log(reqerr+' '/*+ reqerr["_body"] */ + " did not get to server ");

            });
    }

    //pushpage;
    pushPage(str: string, navparams: any){
        this.navCtrl.push(str, navparams);
    }
}

