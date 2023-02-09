import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AESEncryptDecryptServiceService } from './aesencrypt-decrypt-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogin = false;

  roleAs!: string|null;
  roleDec!: string|null;

  constructor(private router: Router, private _AESEncryptDecryptService: AESEncryptDecryptServiceService) { }

  login(value: string) {
    this.isLogin = true;
    this.roleAs = value;
    localStorage.setItem('STATE', 'true');
    localStorage.setItem('url', this._AESEncryptDecryptService.encrypt(this.roleAs));
    return of({ success: this.isLogin, role: this.roleAs });
  }

  logout() {
    this.isLogin = false;
    this.roleAs = '';
    
    let userId = localStorage.getItem('uid');  
    let uidDec = this._AESEncryptDecryptService.uid(); 
    axios.post(`${environment.API_URL}Users/LogOut/${uidDec}`).then( data =>{
      localStorage.setItem('STATE', 'false');
      localStorage.setItem('url', '');
      localStorage.setItem('uid','');
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
    this.roleAs = String(localStorage.getItem('url'));
    this.roleDec = this._AESEncryptDecryptService.decrypt(this.roleAs);
    return this.roleDec;
  }

}
