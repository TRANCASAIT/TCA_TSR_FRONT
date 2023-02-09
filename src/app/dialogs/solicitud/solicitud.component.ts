import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
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
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {
  requests: any;
  stops:any;
  operations: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public request :any,
    public dialogRef: MatDialogRef<SolicitudComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  srequestForm = new FormGroup({
    srId: new FormControl(0),
    boxNumber : new FormControl('', [Validators.required]),
    reference : new FormControl('', [Validators.required]),
    operationType :  new FormControl('', [Validators.required]),
    stop :  new FormControl('', [Validators.required]),
  })
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.srequestForm.controls; }

  async ngOnInit() {
    this.type = this.request.type;
    await this.getOperations();
    await this.getStops();
  }

  createServiceRequest(): void {
    this.userId = this._AESEncryptDecryptService.uid();
    if(this.srequestForm.invalid) return;
    const sr = {
      Box_Number: this.formGroup.boxNumber.value,
      Reference: this.formGroup.reference.value,
      OperationType_Id: this.formGroup.operationType.value,
      Stops_Id: this.formGroup.stop.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+"ServiceRequests/CreateServiceRequest",sr).then(data => {
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


  async getOperations(){
    await this.backEndServices.getOperationTypes().subscribe((res:any) => {this.operations = res})
  }

  async getStops(){
    await this.backEndServices.getStops().subscribe((res:any) => {this.stops = res})
  }

}
