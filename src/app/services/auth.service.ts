import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogin = false;

  roleAs!: string|null;

  constructor(private router: Router) { }

  login(value: string) {
    this.isLogin = true;
    this.roleAs = value;
    localStorage.setItem('STATE', 'true');
    localStorage.setItem('ROLE', this.roleAs);
    return of({ success: this.isLogin, role: this.roleAs });
  }

  logout() {
    this.isLogin = false;
    this.roleAs = '';
    
    let userId = localStorage.getItem('User_Id');   
    axios.post(`${environment.API_URL}Users/LogOut/${userId}`).then( data =>{
      localStorage.setItem('STATE', 'false');
      localStorage.setItem('ROLE', '');
      localStorage.setItem('User_Id','');
      localStorage.setItem('unme','');
    }).catch(error=>{
      
    })
    return of({ success: this.isLogin, role: '' });
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');    
    if (loggedIn == 'true'){
      this.isLogin = true;
    }
    else{
      this.isLogin = false;
    }
    return this.isLogin;
  }

  getRole() {
    this.roleAs = localStorage.getItem('ROLE');
    return this.roleAs;
  }

}
