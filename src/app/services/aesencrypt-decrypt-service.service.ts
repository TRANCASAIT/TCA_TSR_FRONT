import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AESEncryptDecryptServiceService {

  secretKey = "YourSecretKeyForEncryption&Descryption";
  constructor() { }

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  uid(){
    let uid  = String(localStorage.getItem('uid'));
    return CryptoJS.AES.decrypt(uid, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  unme() {
    let unme  = String(localStorage.getItem('unme'));
    return CryptoJS.AES.decrypt(unme, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  urol() {
    let urol  = String(localStorage.getItem('url'));
    return CryptoJS.AES.decrypt(urol, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}
