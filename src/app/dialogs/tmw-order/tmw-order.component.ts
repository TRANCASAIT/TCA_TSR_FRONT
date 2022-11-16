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
  selector: 'app-tmw-order',
  templateUrl: './tmw-order.component.html',
  styleUrls: ['./tmw-order.component.scss']
})
export class TmwOrderComponent implements OnInit {

  tmwOrders: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public tmwOrder :any,
    public dialogRef: MatDialogRef<TmwOrderComponent>,
    private _snackBar: MatSnackBar,
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  twmOrderForm = new FormGroup({
    serviceRequestId: new FormControl({value: 0, disabled: true}),
    tmwOrder : new FormControl('', [Validators.required]),
  })

  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.twmOrderForm.controls; }

  ngOnInit(): void {
    this.type = this.tmwOrder.type;
    const {serviceRequest_Id, tmwOrder } = this.tmwOrder;   
    this.twmOrderForm.patchValue({
      serviceRequestId : serviceRequest_Id,
      tmwOrder: tmwOrder
    });
  }

  setTMW(): void {
    this.userId = localStorage.getItem('User_Id');
    const sr = {
      ServiceRequest_Id: this.formGroup.serviceRequestId.value,
      TMWOrder: this.formGroup.tmwOrder.value,
      User_Logged: this.userId
    }
    console.log(sr);
    
    axios.post(`${environment.API_URL}`+ "ServiceRequests/setTMWOrder",sr).then(data => {
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
