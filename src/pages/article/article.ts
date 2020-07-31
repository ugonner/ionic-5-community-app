import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the ArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider,
      private utilityservice: UtilityservicesProvider) {
  }

  private Articleid: any;
  ionViewDidEnter() {
      this.Articleid = this.navParams.get('articleid');
      this.getArticle(this.Articleid,0);
    console.log('ionViewDidLoad ArticlePage');
  }


    Article: any = {
        "article": {
            "id": 1,
            "title": 'title',
            "articleimagedisplayname": '',
            "categoryname": '',
            "noofviews": '',
            "firstname": ''
        },
        "takes": [{
            "takeid": '',
            "detail": '',
            "commentimagedisplayname": '',
            "firstname": ''
        }],
        "files":[{
            "id": '',
            "title": '',
            "displayname": ''
        }],
        "message": 'No articles',
        "noofpages": 0,
        "pagelistArray": []
    };

    getArticle(articleid,pgn){
        let postdata = {
            "pgn": pgn,
            "gaid": articleid
        };
        this.httpservice.postStuff("/api/article/index2.php",postdata)
            .subscribe((data)=>{
                //alert(data["_body"]);
                //this.utilityservice.presentLoading("article "+data["_body"]);
                if(data.results == "0"){
                    this.Article.message = data.message;
                }else{

                    this.Article.article = data.results.article[0];
                    this.Article.takes = data.results.takes;
                    this.Article.message = data.message;
                    //populate pagelistarray if empty only
                    if(this.Article.pagelistArray.length == 0){
                        for(let i=0; i<data.noofpages; i++){
                            this.Article.pagelistArray.push(i);
                        }
                    }

                    this.utilityservice.presentToast(data.message,1);
                }
            },(err)=>{
                this.Article.message = err.message;
                this.utilityservice.presentToast(err.message,1);
            })
    }


    pushPageWithParameters(PageString , Params: any){

        this.utilityservice.playSound(2);
        this.navCtrl.push(PageString,Params);
    }
}
