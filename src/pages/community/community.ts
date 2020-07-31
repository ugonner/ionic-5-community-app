import { Component, ViewChild } from '@angular/core';
import { IonicPage, Slides, NavController, NavParams } from 'ionic-angular';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, public utilityservice: UtilityservicesProvider) {
  }

    public Groupid: any;
    public ClassMessage: any = ' ';
    public Articles: any = {
        "articles": [{
            "articleid":'',
            "title": '',
            "articleimagedisplayname": '',
            "dateofpublication": ''
        }],
        "no_of_pages": 1,
        "message": 'News And Announcements',
        "pageListArray":[]
    };
    public Group:any = {
        "id": 1,
        "name": 'Ihite',
        'description': 'This is about the Ihite Clan Of Igboukwu'
    };

    public Members: any = {
        "members": [{
            "userid":'',
            "firstname": '',
            "surname": '',
            "profilepic": '',
            "rolenote": ''
        }],
        "no_of_pages": 1,
        "message": 'News And Announcements',
        "pageListArray": []
    };
    public groupleveltableid;
    public groupleveltable;
    public executiveRoleid;

    ionViewDidEnter() {
        this.Groupid = this.navParams.get("groupid");
        this.groupleveltableid = this.navParams.get("groupleveltableid");
        this.groupleveltable = "grouplevel"+this.groupleveltableid;


        //set role
        let roleid = 1;
        if(this.groupleveltableid == 1){
            this.executiveRoleid = 1;
        }else if(this.groupleveltableid == 2){
            this.executiveRoleid = 4;
        }else{
            this.executiveRoleid = 5;
        }

        this.getArticles(0);
        this.getMembers(this.executiveRoleid,0);
        //get USERS;


        setTimeout(()=>{this.setGroups()},200);

    }


    setGroups(){
        let id = this.navParams.get('groupleveltableid');
        let str = "grouplevel"+id+'s';
        //this.utilityservice.presentLoading(str);
        this.utilityservice.storage.get("groups")
            .then((grps)=>{
                if(grps){
                    const mappedgrps = new Map(Object.entries(grps));
                    let grp = mappedgrps.get(str);
                    for(let g=0; g<grp.length; g++){
                        if(grp[g].id == this.Groupid){
                            this.Group = grp[g];
                        }
                    }
                    //this.utilityservice.presentLoading(grp[0].name);
                }else{
                    this.utilityservice.presentLoading('no group '+this.Groupid +' '+ str);
                }
            }).catch((err)=>{
                this.utilityservice.presentLoading("storageErr: "+err);
            })
    }

    getMembers(roleid,pagenumber){
        let pgn = ((pagenumber == '')? 0: pagenumber);
        let tableid_str = this.groupleveltable+'.id';
        let postdata = {
            "property":tableid_str,
            "value": this.Groupid+' AND user.roleid ='+roleid,
            "gubp": true,
            "pgn": pgn,
            "property-alias": 'Community Executives'
        };

        //this.utilityservice.presentLoading(JSON.stringify(postdata));
        //this.utilityservice.presentLoading(postdata.value);
        let users = this.httpservice.postStuff("/api/user/index2.php",postdata).subscribe((userdata)=>{
            let results = userdata.results;
            //this.utilityservice.presentLoading(userdata.text);
            if(results == "0"){
                this.Members.message = userdata.message;
                this.ClassMessage = userdata.message;
                this.utilityservice.presentToast("No users "+this.ClassMessage,1);
            }else{
                this.Members.members = results;
                this.Members.no_of_pages = userdata.no_of_pages;
                this.Members.message = userdata.message;
                if(this.Members.pageListArray.length == 0){
                    for(let i=0; i<userdata.noofpages; i++){
                        this.Members.pageListArray.push(i);
                    }
                }
                this.ClassMessage = userdata.message;
                this.utilityservice.presentToast(" users "+this.ClassMessage,1);
            }
            //this.utilityservice.presentLoading("user "+userdata);

        },(err)=>{
            this.ClassMessage = err;
            this.utilityservice.presentLoading("usererror "+err);
        });
    }


    public getArticles(pagenumber){
        let pgn = ((pagenumber == '')? 0: pagenumber);
        let postdata = {
            "value": this.Groupid,
            "property":this.groupleveltable+'.id',
            "gabp": true,
            "pgn": pagenumber,
            "property-alias": 'Community Notice'
        };
        //this.utilityservice.presentLoading(JSON.stringify(postdata));
        let articles = this.httpservice.postStuff("/api/article/index2.php",postdata).subscribe((data)=>{
            let results = data.results;
            //this.utilityservice.presentLoading("article "+data);
            if(results == "0"){
                this.Members.message = data.message;
                this.ClassMessage = data.message;
                this.utilityservice.presentToast("No article "+this.ClassMessage,1);
            }else{
                this.Articles.articles = results;
                this.Articles.no_of_pages = data.no_of_pages;
                this.Articles.message = data.message;
                if(this.Articles.pageListArray.length == 0){
                    for(let i=0; i<data.noofpages; i++){
                        this.Articles.pageListArray.push(i);
                    }
                }
                this.ClassMessage = (data.message);
                this.utilityservice.presentToast("article "+this.ClassMessage,1);
            }
        },(err)=>{
            this.ClassMessage = err.message;
            this.utilityservice.presentToast("No articlerror "+err.message,1);
        });

        //this.utilityservice.presentLoading(this.ClassMessage);

    }

    pushPageWithParameters(page, parameters: any){
        this.navCtrl.push(page,parameters);
    }

}
