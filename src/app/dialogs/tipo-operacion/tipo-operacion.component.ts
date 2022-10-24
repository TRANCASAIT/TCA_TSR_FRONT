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
  selector: 'app-tipo-operacion',
  templateUrl: './tipo-operacion.component.html',
  styleUrls: ['./tipo-operacion.component.scss']
})
export class TipoOperacionComponent implements OnInit {
  operationTypes: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public operationType :any,
    public dialogRef: MatDialogRef<TipoOperacionComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  operationTypesForm = new FormGroup({
    operationTypeId: new FormControl(0),
    operationType_Name : new FormControl('', [Validators.required]),
  })
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.operationTypesForm.controls; }

  ngOnInit(): void {
    this.type = this.operationType.type;
    if(this.type === 'edit'){
      const {operationType_Id, operationType_Name} = this.operationType.operationType;
      this.operationTypesForm.patchValue({
        operationTypeId: operationType_Id,
        operationType_Name: operationType_Name
      })
    }
  }

  createOperationType(): void {
    this.userId = localStorage.getItem('userId');
    if(this.operationTypesForm.invalid) return;
    const operationType = {
      OperationType_Name: this.formGroup.operationType_Name.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+"OperationTypes/CreateOperationType",operationType).then(data => {
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

  updateOperationType(): void {
    this.userId = localStorage.getItem('userId');
    const operationType = {
      OperationType_Id: this.formGroup.operationTypeId.value,
      OperationType_Name: this.formGroup.operationType_Name.value,
      User_Logged: this.userId
    }
    axios.put(`${environment.API_URL}`+ "OperationTypes/UpdateOperationType",operationType).then(data => {
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
