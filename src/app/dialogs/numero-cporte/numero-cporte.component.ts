import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  selector: 'app-numero-cporte',
  templateUrl: './numero-cporte.component.html',
  styleUrls: ['./numero-cporte.component.scss']
})
export class NumeroCporteComponent implements OnInit {
  consigmentNumbers: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public consigmentNumber :any,
    public dialogRef: MatDialogRef<NumeroCporteComponent>,
    private _snackBar: MatSnackBar,
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  solicitudServicio: number = 0;
  parada: number = 0;
  cPorteForm = new FormGroup({
    serviceRequestId: new FormControl(0),
    documentId: new FormControl(0),
    cPorteNumber : new FormControl('', [Validators.required]),
  })
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.cPorteForm.controls; }

  ngOnInit(): void {
    this.type = this.consigmentNumber.type;
    const {serviceRequest_Id, document_Id, stop_Id, consigment_Note} = this.consigmentNumber;
    
    this.cPorteForm.patchValue({
      serviceRequestId: serviceRequest_Id,
      documentId: document_Id,
      cPorteNumber: consigment_Note
    });
    this.solicitudServicio= serviceRequest_Id;
    this.parada = stop_Id;
  }

  setConsigmentNumber(): void {
    this.userId = localStorage.getItem('User_Id');
    const sr = {
      ServiceRequest_Id: this.formGroup.serviceRequestId.value,
      Document_Id: this.formGroup.documentId.value,
      Consigment_Note: this.formGroup.cPorteNumber.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+ "ServiceRequests/setConsigmentNote",sr).then(data => {
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
      console.log(error);
      
      this._snackBar.open(error,'',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    });
    
  }


}
