import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router,public authService: AuthService
    ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
   }
   UserActive!:string|null;
   @Input() usuario:any;
   UserName: string = "";
   User_Password: string = "";
   mensajeError: string = "";
   errorMessage: Boolean = false;
 
  ngOnInit(): void {
    this.logOut();
  }

  login(val: string, userId: number) {
    this.authService.login(val)
      .subscribe(res => {
        if (res.success) {
          localStorage.setItem('User_Id',String(userId));   
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

  register() {
    //Hola
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
          this.login(environment.UserRoles.Rol1,data.data.user_Id);
          var el = document.getElementById("logSpinner");
          el!.style.display ='contents';
        }
        else if(data.data.isCustomer === environment.CustomerCheck.NotACustomer && data.data.userType_Name === environment.UserTypes.Type2){
          this.login(environment.UserRoles.Rol2,data.data.user_Id);
          this.cargarSpinner();
        }
        else if(data.data.isCustomer === environment.CustomerCheck.NotACustomer && data.data.userType_Name === environment.UserTypes.Type3){
          this.login(environment.UserRoles.Rol3,data.data.user_Id);
          this.cargarSpinner();
        }
        else if(data.data.isCustomer === environment.CustomerCheck.IsCustomer && data.data.userType_Name === environment.UserTypes.Type2){
          this.login(environment.UserRoles.Rol4,data.data.user_Id);
          this.cargarSpinner();
        }
        else if(data.data.isCustomer === environment.CustomerCheck.IsCustomer && data.data.userType_Name === environment.UserTypes.Type3){
          this.login(environment.UserRoles.Rol5,data.data.user_Id);
          this.cargarSpinner();
        }
      }        
      }).catch(error => {
        if(error.response.data.state === 1 ){
          console.log(error.response.data.message);
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
}
