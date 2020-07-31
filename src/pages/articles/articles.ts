import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';

/**
 * Generated class for the ArticlesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-articles',
  templateUrl: 'articles.html',
})
export class ArticlesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpservice: HttpserviceProvider,
      private utilityservice: UtilityservicesProvider) {
  }


    private Property: any = '';
    private Property_alias: any = '';
    private Value: any = '';


    Articles: any = {
        "articles": [{
            "articleid": 1,
            "title": "No Posts Here Yet",
            "articleimagedisplayname": '/api/img/articles/article.jpg',
            "categoryname": '',
            "noofviews": '',
            "userid": 1,
            "firstname": ''
        }],
        "message": 'No articles',
        "noofpages": 0,
        "pagelistArray": []
    };

    ionViewDidLoad() {
      this.Property = this.navParams.get('property');
      this.Property_alias = this.navParams.get('property-alias');
      this.Value = this.navParams.get('value');

      this.getArticles(0);
    console.log('ionViewDidLoad ArticlesPage');
  }

    getArticles(pgn){
      let postdata: any = {
          "gabp": true,
          "property": this.Property,
          "property-alias": this.Property_alias,
          "value": this.Value,
          "pgn": pgn
      };
      this.httpservice.postStuff("/api/article/index2.php",postdata)
          .subscribe((data)=>{
              if(data.results == "0"){
                  this.Articles.message = data.message;
              }else{
                  this.Articles.articles = data.results;
                  this.Articles.message = data.message;
                  //populate pagelistarray if empty only
                  if(this.Articles.pagelistArray.length == 0){
                      for(let i=0; i<data.noofpages; i++){
                          this.Articles.pagelistArray.push(i);
                      }
                  }
                  this.utilityservice.presentToast(data.message,1);
              }
          },(err)=>{
              this.Articles.message = err.message;
              this.utilityservice.presentLoading(err.message);
          })
  }


    pushPageWithParameters(PageString , Params: any){

        this.utilityservice.playSound(2);
        this.navCtrl.push(PageString,Params);
    }
}
