import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import { environment } from 'src/environments/environment';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-tipo-usuario',
  templateUrl: './tipo-usuario.component.html',
  styleUrls: ['./tipo-usuario.component.scss']
})
export class TipoUsuarioComponent implements OnInit {
  userTypes: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public userType :any,
    public dialogRef: MatDialogRef<TipoUsuarioComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  userTypesForm = new FormGroup({
    userTypeId: new FormControl(0),
    userType_Name : new FormControl('', [Validators.required]),
  })
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.userTypesForm.controls; }

  ngOnInit(): void {
    this.type = this.userType.type;
    if(this.type === 'edit'){
      const {userType_Id, userType_Name} = this.userType.userType;
      this.userTypesForm.patchValue({
        userTypeId: userType_Id,
        userType_Name: userType_Name
      })
    }
  }

  createUserType(): void {
    this.userId = localStorage.getItem('userId');
    if(this.userTypesForm.invalid) return;
    const userType = {
      UserType_Name: this.formGroup.userType_Name.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+"UserTypes/CreateUserType",userType).then(data => {
      if(data.data.state === 0){
        this._snackBar.open(data.data.message,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
    }
    else if(data.data.state === 1){
      this._snackBar.open(data.data.message,'',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
  }
      this.dialogRef.close(); 
    }).catch(error => {
      this._snackBar.open(error,'',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

  updateUserType(): void {
    this.userId = localStorage.getItem('userId');
    const userType = {
      UserType_Id: this.formGroup.userTypeId.value,
      UserType_Name: this.formGroup.userType_Name.value,
      User_Logged: this.userId
    }
    axios.put(`${environment.API_URL}`+ "UserTypes/UpdateUserType",userType).then(data => {
      if(data.data.state === 0){
        this._snackBar.open(data.data.message,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
      }
      else if(data.data.state === 1){
        this._snackBar.open(data.data.message,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
    }
    this.dialogRef.close(); 
    }).catch(error => {
      this._snackBar.open(error,'',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    });
    
  }
}
