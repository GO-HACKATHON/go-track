import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GOTrackSDK {

  baseUrl: string = "http://gotrack.susan.to"; 

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
        callback(resp.json(), null);
      }, (err) => {
        callback(null, err);
        console.log("error");
      });
  }

  getTrackeeById(id, callback) {
    this.http.get(`${this.baseUrl}/trackeeById/${id}`)
      .subscribe((resp) => {
        callback(resp.json(), null);
      }, (err) => {
        callback(null, err);
        console.log("error");
      });
  }

  getLocationsByIds(ids, callback) {
    this.http.post(`${this.baseUrl}/locationsByIds`, ids)
      .subscribe((resp) => {
        callback(resp.json());
      }, (err) => {
        console.log("error");
      });
  }

  getTrackeesByIds(ids, callback) {
    this.http.post(`${this.baseUrl}/trackeesByIds`, ids)
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

  register(data, callback) {
    this.http.post(`${this.baseUrl}/register`, data)
      .subscribe((resp) => {
        callback(resp.json());
      }, (err) => {
        console.log("error");
      });
  }

  authorize(data, callback) {
    this.http.post(`${this.baseUrl}/authorize`, data)
      .subscribe((resp) => {
        callback(resp.json());
      }, (err) => {
        console.log("error");
      });
  }
}
