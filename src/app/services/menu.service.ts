import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { menu } from '../interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor( private http: HttpClient ) { }

  getMenu(usertype: any):Observable<menu[]>{
    let typeMenu;
    if (usertype === environment.UserRoles.Rol1 ){
      typeMenu = './assets/data/menu.json';
    }else if(usertype === environment.UserRoles.Rol2 || usertype === environment.UserRoles.Rol3){
      typeMenu = './assets/data/menu-A.json';
    }else if(usertype === environment.UserRoles.Rol4 || usertype === environment.UserRoles.Rol5){
      typeMenu = './assets/data/menu-B.json';
    }else{
      typeMenu = './assets/data/menu-B.json';
    }
    return this.http.get<menu[]>(typeMenu);
  }
}
