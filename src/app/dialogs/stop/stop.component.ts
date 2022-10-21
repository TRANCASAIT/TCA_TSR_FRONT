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
  selector: 'app-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.scss']
})
export class StopComponent implements OnInit {
  stops: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public stop :any,
    public dialogRef: MatDialogRef<StopComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  stopsForm = new FormGroup({
    stopId: new FormControl(0),
    stopNumber : new FormControl('', [Validators.required]),
  })
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.stopsForm.controls; }

  ngOnInit(): void {
    this.type = this.stop.type;
    if(this.type === 'edit'){
      
      const {stop_Id, stop_Number} = this.stop.stop;
      console.log(this.stop);
      
      this.stopsForm.patchValue({
        stopId: stop_Id,
        stopNumber: stop_Number
      })
    }
  }

  createStop(): void {
    this.userId = localStorage.getItem('userId');
    if(this.stopsForm.invalid) return;
    const stop = {
      Stop_Number: this.formGroup.stopNumber.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+"Stops/CreateStop",stop).then(data => {
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

  updateStop(): void {
    this.userId = localStorage.getItem('userId');
    const stop = {
      Stop_Id: this.formGroup.stopId.value,
      Stop_Number: this.formGroup.stopNumber.value,
      User_Logged: this.userId
    }
    axios.put(`${environment.API_URL}`+ "Stops/UpdateStop",stop).then(data => {
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
