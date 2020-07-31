import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private httpservice: HttpserviceProvider) {

  }

    ionViewDidEnter(){
        this.httpservice.postStuff("/api/paragraph/index.php",{"getlaw": "yes"})
            .subscribe((data)=>{
                alert(data.result.sections[0].subsections[0].paragraphs[0].paragraphtext);
                //alert(data.message);
            },(err)=>{
                alert(err.message);
            })
    }

}
