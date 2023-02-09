import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';

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
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.scss']
})
export class EstadoComponent implements OnInit {
  estados: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public state :any,
    public dialogRef: MatDialogRef<EstadoComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  stateForm = new FormGroup({
    stateId: new FormControl(0),
    stateName : new FormControl('', [Validators.required]),
  })
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.stateForm.controls; }
  
  ngOnInit(): void {
    this.type = this.state.type;
    if(this.type === 'edit'){
      const {state_Id, state_Name} = this.state.state;
      this.stateForm.patchValue({
        stateId: state_Id,
        stateName: state_Name
      })
    }
  }


  createState(): void {
    this.userId = this._AESEncryptDecryptService.uid();
    if(this.stateForm.invalid) return;
    const state = {
      State_Name: this.formGroup.stateName.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+"States/CreateState",state).then(data => {
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

  updateState(): void {
    this.userId = this._AESEncryptDecryptService.uid();
    const state = {
      State_Id: this.formGroup.stateId.value,
      State_Name: this.formGroup.stateName.value,
      User_Logged: this.userId
    }
    axios.put(`${environment.API_URL}`+ "States/UpdateState",state).then(data => {
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
