import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email:string | undefined;
  password:string | undefined;
  remail:string | undefined;
  newPassword:string | undefined;
  confirmPassword:string | undefined;

  constructor(private snackBar:MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }
  register() {
    //Hola
  }
  login() {
    if(this.email=="admin" && this.password=="admin"){
        this.snackBar.open('Login Successful','',{duration:1000})
        this.router.navigate(['navigation/solicitudes']);
    }else{
      this.snackBar.open('Login error','',{duration:1000})
    }
  }

}
