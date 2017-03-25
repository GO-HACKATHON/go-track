import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

@Injectable()
export class Trackees {

  baseUrl: string = "https://go-track-api.herokuapp.com"; 

  constructor(private http: Http) {
  }

  getList(callback) {
    this.http.get(`${this.baseUrl}/trackee`)
      .subscribe((resp) => {
        callback(resp.json());
      }, (err) => {
        console.log("error");
      });
  }

  getLocationById(id, callback) {
    this.http.get(`${this.baseUrl}/locationById/${id}`)
      .subscribe((resp) => {
        callback(resp.json());
      }, (err) => {
        console.log("error");
      });
  }

  getByID(id: number) {
    // return this.api.get(`${this.baseUrl}/trackeeById/${id}`)
    //   .map(resp => resp.json());
  }

  store(data: any) {
    // return this.api.post(`${this.baseUrl}/trackee`, data)
    //   .map(resp => resp.json());
  }

}
