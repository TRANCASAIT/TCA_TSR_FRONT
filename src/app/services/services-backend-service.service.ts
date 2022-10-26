import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

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

  getCustomers(): any { 
    return this.http.get(`${this._URL}/Customers/GetCustomers`);
  }


    ////////////////////////////////INSERT INFORMATION API ///////////////////////////////////

    InsertUser(user:any): any {
      return this.http.post(`${this._URL}/Users/CreateUser`,user).pipe( map (
        (response: { [x: string]: any; }) => response ),
        catchError ( this.manejarError )
      );
    }



    UpdateUser(user:any): any {
      return this.http.put(`${this._URL}/Users/UpdateUser`,user).pipe( map (
        (response: { [x: string]: any; }) => response ),
        catchError ( this.manejarError )
      );
    }


    UserPutState(user:any): any {
      return this.http.put(`${this._URL}/Users/UserPutState`,user).pipe( map (
        (response: { [x: string]: any; }) => response ),
        catchError ( this.manejarError )
      );
    }


    manejarError( error: HttpErrorResponse){
      return throwError(`Error en crear el registro`);
    }

}
