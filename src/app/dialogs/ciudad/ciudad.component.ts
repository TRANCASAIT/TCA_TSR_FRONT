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
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.scss']
})
export class CiudadComponent implements OnInit {
  estados: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public city :any,
    public dialogRef: MatDialogRef<CiudadComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
  ) { }
  states: any;
  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  citiesForm = new FormGroup({
    cityId: new FormControl(0),
    cityName : new FormControl('', [Validators.required]),
    state    : new FormControl(''),
  })
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.citiesForm.controls; }
  
  async ngOnInit() {
    this.type = this.city.type;
    if(this.type === 'edit'){
      const {city_Id, city_Name, state_Id} = this.city.city;
      this.citiesForm.patchValue({
        cityId: city_Id,
        cityName: city_Name
      });
      this.citiesForm.controls['state'].setValue(state_Id);
    }
   await this.getStates();
  }

  createCity(): void {
    this.userId = localStorage.getItem('User_Id');
    if(this.citiesForm.invalid) return;
    const city = {
      City_Name: this.formGroup.cityName.value,
      State_Id : this.formGroup.state.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+"Cities/CreateCity",city).then(data => {
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

  updateCity(): void {
    this.userId = localStorage.getItem('User_Id');
    const city = {
      City_Id: this.formGroup.cityId.value,
      City_Name: this.formGroup.cityName.value,
      State_Id : this.formGroup.state.value,
      User_Logged: this.userId
    }
    axios.put(`${environment.API_URL}`+ "Cities/UpdateCity",city).then(data => {
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

  async getStates(){
    await this.backEndServices.getStates().subscribe((res:any) => {this.states = res})
  }
}
