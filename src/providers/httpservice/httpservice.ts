import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/map';

/*
  Generated class for the HttpserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpserviceProvider {

  constructor(public http: Http) {
    console.log('Hello HttpserviceProvider Provider');
  }


    //public hostdomain = "http://localhost";
    public hostdomain = "https://disabilitylawcenter-anambra.com.ng";
    public headers = new Headers({
        "Content-Type": "application/json"
    });

    public requestoptions = new RequestOptions({
        headers: this.headers,
        //withCredentials: true
    });

    postStuff(uri: String, postdata): Observable<any>{
        let url = this.hostdomain + uri;
        return this.http.post(url,postdata, this.requestoptions).map(res=> <any>res.json());
    }

    postStuffRawOutput(uri: String, postdata): Observable<any>{
        let url = this.hostdomain + uri;
        return this.http.post(url,postdata,this.requestoptions);

    }


/*
    postStuffRawOutput(uri: String, postdata): Observable<any>{
        //let requestoptions = new HttpHeaders().set("Content-type", "application/json").set("withCredentials", "true");
        let url = this.hostdomain + uri;
        return this.http.post(url,postdata,
            {
                //headers: new HttpHeaders().set("Content-type", "application/json"),
                responseType: 'text'
            }
        );
    }

    postStuff(uri: String, postdata){
        let url = this.hostdomain + uri;
        return this.http.post(url,postdata,
            {
                headers: new HttpHeaders().set("Content-type", "application/json"),
                //responseType: 'text'
            });

    }
*/


}
