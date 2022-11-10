import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import axios from 'axios';
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
  selector: 'app-estatus',
  templateUrl: './estatus.component.html',
  styleUrls: ['./estatus.component.scss']
})
export class EstatusComponentDialog implements OnInit {
  estatus: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public status :any,
    public dialogRef: MatDialogRef<EstatusComponentDialog>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  statusForm = new FormGroup({
    statusId: new FormControl(0),
    statusDescription : new FormControl('', [Validators.required]),
  })
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.statusForm.controls; }

  ngOnInit(): void {
    this.type = this.status.type;
    if(this.type === 'edit'){
      const {status_Id, status_Description} = this.status.status;
      this.statusForm.patchValue({
        statusId: status_Id,
        statusDescription: status_Description
      })
    }
  }

  createStatus(): void {
    this.userId = localStorage.getItem('User_Id');
    if(this.statusForm.invalid) return;
    const status = {
      Status_Description: this.formGroup.statusDescription.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+"Status/CreateStatus",status).then(data => {
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

  updateStatus(): void {
    this.userId = localStorage.getItem('User_Id');
    const status = {
      Status_Id: this.formGroup.statusId.value,
      Status_Description: this.formGroup.statusDescription.value,
      User_Logged: this.userId
    }
    axios.put(`${environment.API_URL}`+ "Status/UpdateStatus",status).then(data => {
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
