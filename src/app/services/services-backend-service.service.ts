import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicesBackendService {

  _URL: string = 'https://localhost:7014/api';
  constructor(private http: HttpClient) { }
  /*
    Colorful comments extension
    Red (!)
    Blue (?)
    Green (*)
    Yellow (^)
    Pink (&)
    Purple (~)
    Mustard (todo)
    Grey (//) 
  */
  //!--------------------------------------- GET DATA--------------------------------

  getStates(): any {
    return this.http.get(`${this._URL}/States/GetStates`);
  }
  
  getStatuses(): any {
    return this.http.get(`${this._URL}/Status/GetStatuses`);
  }

  getStops(): any {
    return this.http.get(`${this._URL}/Stops/GetStops`);
  }

  getUserTypes(): any {
    return this.http.get(`${this._URL}/UserTypes/GetUserTypes`);
  }

  getOperationTypes(): any {
    return this.http.get(`${this._URL}/OperationTypes/GetOperationTypes`);
  }

  getCities(): any {
    return this.http.get(`${this._URL}/Cities/GetCities`);
  }

  getUsers(): any {
    return this.http.get(`${this._URL}/Users/GetUsers`);
  }
}
