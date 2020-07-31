import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the ClusterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cluster',
  templateUrl: 'cluster.html',
})
export class ClusterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private utilityservice: UtilityservicesProvider) {
  }

   Cluster: any = {
       "clusterid": '',
       "clustername": '',
       "clusternote": ''
   };

    public Articles: any = {
        "articles": [{
            "articleid":'',
            "title": '',
            "articleimagedisplayname": '',
            "dateofpublication": '',
            "categoryname": ''
        }],
        "no_of_pages": 1,
        "message": 'News And Announcements',
        "pagelistArray": []
    };
   Clustername: any;
  ionViewDidEnter() {
    let clusterid = this.navParams.get("clusterid");
    this.utilityservice.storage.get("clusters")
        .then((cls)=>{
            if(cls){
                for(let c=0; c<cls.length; c++){
                    if(clusterid == cls[c].clusterid){
                        this.Cluster = cls[c];
                    }
                }
                this.utilityservice.presentLoading(this.Cluster.name);
            }else{
                this.utilityservice.presentLoading("no clusters found");
            }
        }).catch((storerr)=>{
            this.utilityservice.presentLoading(storerr+" storage error");
        });

      this.getArticles(clusterid,0);
    console.log('ionViewDidLoad ClusterPage');
  }

    public getArticles(clusterid,pagenumber){
        let postdata: any = {
            "gabp": true,
            "property": 'clusterid',
            "value": clusterid,
            "pgn": pagenumber
        };
        this.httpservice.postStuff("/api/article/index2.php",postdata)
            .subscribe((data)=>{
                if(data.results == "0"){
                    //alert(data.message);
                    this.utilityservice.presentToast(data.message,1);
                }else{
                    let result_articles = data.results;
                    if((result_articles == false) || (result_articles == null) || (result_articles.length == 0)){
                        this.Articles.message = "No announcements in this package";
                    }else{
                        this.Articles.articles = result_articles;
                        this.Articles.message = data.message;
                        if(this.Articles.pagelistArray.length == 0){
                            for(let i=0; i<data.noofpages; i++){
                                this.Articles.pagelistArray.push(i);
                            }
                        }
                        //this.Articles.message = "no new ";
                    }
                    //this.Cluster = data.results.cluster;
                    this.utilityservice.presentLoading("Article: "+this.Articles.message);
                }
            },(err)=>{
                this.utilityservice.presentLoading(err+'internet error in getting package');
            })
    }


    pushPageWithParameters(page, parameters: any){
        this.navCtrl.push(page,parameters);
    }
}
