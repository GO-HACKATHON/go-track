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

  existById(id: string, callback) {
    this.http.get(`${this.baseUrl}/trackeeById/${id}`)
      .subscribe((resp) => {
        callback(true);
      }, (err) => {
        callback(false);
      });
  }

  store(data, callback) {
    this.http.post(`${this.baseUrl}/trackee`, data)
      .subscribe((resp) => {
        callback(resp.json());
      }, (err) => {
        console.log("error");
      });
  }

}
