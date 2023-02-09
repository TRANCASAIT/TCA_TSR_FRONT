import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import { environment } from 'src/environments/environment';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-operation-type',
  templateUrl: './operation-type.component.html',
  styleUrls: ['./operation-type.component.scss']
})
export class OperationTypeComponent implements OnInit {
  operationTypes:any;
  matcher = new MyErrorStateMatcher();
  userId!: string|null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public opt :any,
    public dialogRef: MatDialogRef<OperationTypeComponent>,
    private _formBuilder: FormBuilder, public dialog : MatDialog,
    private backEndServices : ServicesBackendService,
    private _snackBar: MatSnackBar,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService
  ) { }
  operations: any;
  type: string | undefined;
  srequestForm = new FormGroup({
    srId: new FormControl(0),
    operationType :  new FormControl('', [Validators.required]),
  });
  get formGroup() { return this.srequestForm.controls; }

  async ngOnInit(){
    this.type = this.opt.type;
    if(this.opt.type === 'edit'){
      const { serviceRequest_Id, operationType_Id} = this.opt;
      this.srequestForm.patchValue({
        srId : serviceRequest_Id,

      })
      this.srequestForm.controls['operationType'].setValue(operationType_Id);
      this.getOperationTypes();
    }
  }


  async getOperationTypes(){
    await this.backEndServices.getOperationTypes().subscribe((res:any) => {this.operationTypes = res})
  }

  updateOperationType(){
    this.userId = this._AESEncryptDecryptService.uid();
    let operationType = {
      ServiceRequest_Id : this.formGroup.srId.value,
      OperationType_Id: this.formGroup.operationType.value,
      User_Logged: this.userId
    }

    axios.put(`${environment.API_URL}`+ "ServiceRequests/UpdateOperationType",operationType).then(data => {
      if(data.data.state === 0){
        this._snackBar.open(data.data.message,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
        this.dialogRef.close(); 
      }
      else if(data.data.state === 1){
        this._snackBar.open(data.data.message,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
    }
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
