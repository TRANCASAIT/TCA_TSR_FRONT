import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { ServicesBackendService } from '../services/services-backend-service.service';
import { AESEncryptDecryptServiceService } from '../services/aesencrypt-decrypt-service.service';
import * as crypto from "crypto-js";

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formForget: FormGroup;
  loading: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  submitted = false;
  hide = true;
  hide2 = true;
  hide3 = true;
  hide4 = true;
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router,public authService: AuthService,
    public dialog: MatDialog,    private backEndServices : ServicesBackendService, private _AESEncryptDecryptService: AESEncryptDecryptServiceService
    ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.formForget = this.fb.group({
      email: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['',[ Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      newPasswordConfirmation: ['', Validators.required],
    },
    {
      validators: [Validation.match('newPassword', 'newPasswordConfirmation')],
    });
   }
   isDisplayed = true;
   UserActive!:string|null;
   @Input() usuario:any;
   UserName: string = "";
   User_Password: string = "";
   mensajeError: string = "";
   errorMessage: Boolean = false;
 
  ngOnInit(): void {
    this.logOut();
  }

  login(val: string, userId: number, userName:string) {
    this.authService.login(val)
      .subscribe(res => {
        if (res.success) {
          localStorage.setItem('uid',this._AESEncryptDecryptService.encrypt(String(userId)));  
          localStorage.setItem('unme',this._AESEncryptDecryptService.encrypt(String(userName)));  
          if(res.role === environment.UserRoles.Rol1){
            setTimeout(() => {
              this.router.navigate(["navigation/solicitudes"]);
              this.loading = false;
              },1500);
          }else if(res.role === environment.UserRoles.Rol2 || res.role === environment.UserRoles.Rol3){
            setTimeout(() => {
              this.router.navigate(["navigate/solicitudes"]);
              this.loading = false;
              },1500);
          }else if(res.role === environment.UserRoles.Rol4 || res.role === environment.UserRoles.Rol5){
            setTimeout(() => {
              this.router.navigate(["nav/solicitudes"]);
              this.loading = false;
              },1500);
          }
        }
      });
  }

  resetMessage(): void{
    setTimeout(() => {
      this.errorMessage = false;
      this.mensajeError = "";
    },3000);
  }

  logOut(): void{
    this.authService.logout();
  }



  ingresar() {
    var usuario = {
      UserName : this.form.value.email,
      Password : this.form.value.password
    }
      axios.post(`${environment.API_URL}`+ "Users/PostUserLogin",usuario).then(data => {      
        if(data.data.user_Id > 0 ){       
          if(data.data.isCustomer === environment.CustomerCheck.NotACustomer && data.data.userType_Name === environment.UserTypes.Type1){
            this.login(environment.UserRoles.Rol1,data.data.user_Id,data.data.userName);
            var el = document.getElementById("logSpinner");
            el!.style.display ='contents';
          }
          else if(data.data.isCustomer === environment.CustomerCheck.NotACustomer && data.data.userType_Name === environment.UserTypes.Type2){
            this.login(environment.UserRoles.Rol2,data.data.user_Id,data.data.userName);
            this.cargarSpinner();
          }
          else if(data.data.isCustomer === environment.CustomerCheck.NotACustomer && data.data.userType_Name === environment.UserTypes.Type3){
            this.login(environment.UserRoles.Rol3,data.data.user_Id,data.data.userName);
            this.cargarSpinner();
          }
          else if(data.data.isCustomer === environment.CustomerCheck.IsCustomer && data.data.userType_Name === environment.UserTypes.Type2){
            this.login(environment.UserRoles.Rol4,data.data.user_Id,data.data.userName);
            this.cargarSpinner();
          }
          else if(data.data.isCustomer === environment.CustomerCheck.IsCustomer && data.data.userType_Name === environment.UserTypes.Type3){
            this.login(environment.UserRoles.Rol5,data.data.user_Id,data.data.userName);
            this.cargarSpinner();
          }
        }        
        }).catch(error => {
          if(error.response.data.state === 1 ){
            this.errorMessage = true;
            this.mensajeError = error.response.data.message;
            this.resetMessage();
          }
        });
  }

  cargarSpinner(){
    var el = document.getElementById("logSpinner");
    el!.style.display ='contents';
  }

  
  changePass(){
    this.isDisplayed = false;
    this.form.reset();
    this.formForget.reset();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formForget.controls;
  }

  resetPassword():any{
    this.submitted = true;
    if (this.formForget.invalid) {
      return;
    }

    
    let obj= {
      Email: this.formForget.controls['email'].value,
      OldPassword: this.formForget.controls['oldPassword'].value,
      NewPassword: this.formForget.controls['newPassword'].value
    }
    this.backEndServices.ChangePassword(obj).subscribe((response:any) => {
      if (response['state'] === 0){
        this._snackBar.open(response['message'],'',{
          duration:5000,
          horizontalPosition:'center',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
        this.hiden();
        this.formForget.reset();
      }else if (response['state'] === 1){
        this._snackBar.open(response['message'],'',{
          duration:5000,
          horizontalPosition:'center',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
      }
    }),(error: any) => {
      this._snackBar.open(error,'',{
        duration:10000,
        horizontalPosition:'center',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    }
  }

  hiden(){
    this.isDisplayed = true;
  }
}
