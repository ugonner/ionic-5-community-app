import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';
import { TextToSpeech,TTSOptions } from '@ionic-native/text-to-speech';

//import { ChangeDetectorRef } from "@angular/core";

/**
 * Generated class for the SectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-section',
  templateUrl: 'section.html',
})
export class SectionPage {

   public langcode: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private utilityservice: UtilityservicesProvider,
      private tts: TextToSpeech, public changeDetectorRef: ChangeDetectorRef, public alertCtrl: AlertController) {
    this.langcode = this.navParams.get("langcode");

      //this.utilityservice.presentToast("got the langcode"+this.langcode,2);
  }
  private Section: any = {
      "id": 1,
      "title": 'Wait',
      "paragraphtext": 'wait',
      "paragraphigbotext": 'wait',
      "paragraphannotation": 'wait',
      "subsections": [{
          "id": 1,
          "title": 'Wait',
          "paragraphtext": 'wait',
          "paragraphigbotext": 'wait',
          "paragraphannotation": 'wait',
          "subsectionparagraphs":[{
              "id": 1,
              "title": 'Wait',
              "paragraphtext": 'wait',
              "paragraphigbotext": 'wait',
              "paragraphannotation": 'wait'
          }]
      }]
  };
  private SubSections: any = [{
      "id": 1,
      "title": 'Wait',
      "paragraphtext": 'wait',
      "paragraphigbotext": 'wait',
      "paragraphannotation": 'wait',
      "subsectionparagraphs":[{
          "id": 1,
          "title": 'Wait',
          "paragraphtext": 'wait',
          "paragraphigbotext": 'wait',
          "paragraphannotation": 'wait'
      }]
  }];
  private SectionNumber: any;
  private SectionId;

    ionViewDidEnter() {
        this.changeDetectorRef.detectChanges();
    }
  ionViewCanEnter() {
    this.SectionNumber = this.navParams.get("sectionnumber");
    this.SectionId = this.navParams.get("sectionid");
            this.storage.get("law")
                .then((law)=>{
                    if(law){
                        //this.utilityservice.presentToast("Got the law"+law.sections.length, 2);
                        let lawlength = law.sections.length;
                        for(let i=0; i<lawlength; i++){
                            //this.utilityservice.presentToast("Got"+this.law.sections[i].id, 2);
                            if(law.sections[i].id == this.SectionId){
                                this.Section = law.sections[i];
                                this.SubSections = law.sections[i].subsections;
                                //this.utilityservice.presentToast("section set ", 1);
                            }
                        }
                    }else{
                        this.utilityservice.presentToast("No Law Found On Device, refresh", 2);
                    }
                }).catch((err)=>{
                    this.utilityservice.presentToast( err.message+" Unable to access device storage", 2);
                });

    console.log('ionViewDidLoad SectionPage');
  }

    /*public Displaysp = ' ';
    toggleSectionDiv(id){
        let div: HTMLElement = document.getElementById("spt"+id);
        let div2 = document.querySelector("#spt"+id);
        if(div2){
            let hiddenVal = div.getAttribute("hidden");
            let style = getComputedStyle(div).display;
            if(style == "none"){
                div.style.display = "block";
            }else{
                div.style.display = "none";
            }
            this.utilityservice.presentToast(style + " is stye" +div.getAttribute("hidden")+" the hidden ",2);
        }else{
            this.utilityservice.presentToast("spit"+id,2);
        }
    }*/



    //label for the paragraph language in display
   public Label: Array<string> = [
    "<b><i><small class='splabels'>English</small></i></b><br>",
    "<b><i><small class='splabels'>Igbo</small></i></b><br>",
    "<b><i><small class='splabels'>What This Means</small></i></b><br>"
    ];

    echoText(textObj){
        return this.utilityservice.echoTextInTranslation(textObj,this.langcode);
    }

    toggleParagraphText(Div_id,Displaytext){
        let spdiv: HTMLElement = document.getElementById(Div_id);
        spdiv.innerHTML = Displaytext;
        this.changeDetectorRef.detectChanges();
    }

    showTeztAlert(text){

        let alert = this.alertCtrl.create({
            "title": 'Translation',
            "message": text,
            "buttons":[
                {
                    "text": "Ok",
                    "handler":()=>{
                        this.utilityservice.playSound(1);
                        return true;
                    }
                }
            ]

        });
        alert.present();
        this.utilityservice.playSound(2);
    }


    chooseTranslation(igbo, english, pidgin){
        let alert = this.alertCtrl.create({
            "title": 'Select Language Translation',
            "message": "Translation in",
            "cssClass": "section-label",
            "buttons":[
                {
                    "text": "English",
                    "handler":()=>{
                        this.showTeztAlert(english)
                    }
                },
                {
                    "text": "Igbo",
                    "handler":()=>{
                        this.showTeztAlert(igbo)
                    }
                },
                {
                    "text": "Pidgin",
                    "handler":()=>{
                        this.showTeztAlert(pidgin)
                    }
                },
                {
                    "text": "Read Out",
                    "handler":()=>{
                        this.utilityservice.playSound(2);
                        this.speakText(english)
                        let alert = this.alertCtrl.create({
                            "title": "Stop Speech",
                            "message": "stop this speech",
                            "buttons": [
                                {
                                    "text": "Stop",
                                    "handler": ()=>{
                                        this.utilityservice.playSound(1);
                                        this.stopSpeakingText();
                                    }
                                }
                            ]
                        });
                        alert.present();
                    }
                }
            ]

        });
        alert.present();
        this.utilityservice.playSound(1);

    }

    //private speaking: TextToSpeech;
    speakText(text){
        let ttsOption: TTSOptions = {
            "text": text
        };
        this.tts.speak(ttsOption)
            .then((spoke)=>{
                console.log("speaking");
            }).catch((err)=>{
                this.utilityservice.presentToast("unable to speak "+err,1);
            })


    }

    stopSpeakingText(){
        this.tts.speak("")
            .then((stopped)=>{
                console.log("speech stopped");
            }).catch((err)=>{
                this.utilityservice.presentToast(err,1);
            })
    }
}
