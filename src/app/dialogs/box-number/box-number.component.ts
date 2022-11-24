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
  selector: 'app-box-number',
  templateUrl: './box-number.component.html',
  styleUrls: ['./box-number.component.scss']
})
export class BoxNumberComponent implements OnInit {
  boxNumbers: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public boxNumber :any,
    public dialogRef: MatDialogRef<BoxNumberComponent>,
    private _snackBar: MatSnackBar,
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  boxNumberForm = new FormGroup({
    serviceRequestId: new FormControl({value: 0, disabled: true}),
    boxNumber : new FormControl('', [Validators.required]),
  });
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.boxNumberForm.controls; }

  ngOnInit(): void {
    const {serviceRequest_Id, box_Number } = this.boxNumber;
    this.boxNumberForm.patchValue({
      serviceRequestId : serviceRequest_Id,
      boxNumber: box_Number
    });
  }

  updateBoxNumber(): void {
    this.userId = localStorage.getItem('User_Id');
    const sr = {
      ServiceRequest_Id: this.formGroup.serviceRequestId.value,
      Box_Number: this.formGroup.boxNumber.value,
      User_Logged: this.userId
    }
    axios.put(`${environment.API_URL}`+ "ServiceRequests/UpdateBoxNumber",sr).then(data => {
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
