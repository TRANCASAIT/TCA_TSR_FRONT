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
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  customers: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public customer :any,
    public dialogRef: MatDialogRef<ClienteComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService
  ) { }

  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  cities: any;
  states: any;
  customerForm = new FormGroup({
    customerId: new FormControl(0),
    name : new FormControl('', [Validators.required]),
    rfc : new FormControl('', [Validators.required]),
    street : new FormControl('', [Validators.required]),
    streetExt : new FormControl('', [Validators.required]),
    suburb : new FormControl('', [Validators.required]),
    streetInt : new FormControl(''),
    zipCode : new FormControl('', [Validators.required]),
    city : new FormControl('', [Validators.required]),
    state : new FormControl('', [Validators.required]),
    phoneNumber : new FormControl('', [Validators.required]),
    email : new FormControl('', [Validators.required]),
  });
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.customerForm.controls; }
  
  async ngOnInit() {
    this.type = this.customer.type;
    if(this.type === 'edit'){
      const {customer_Id, name, rfc, street, streetExt, streetInt, zipCode, suburb, city_Id, state_Id, phoneNumber, 
        email} = this.customer.customer;
      this.customerForm.patchValue({
        customerId: customer_Id,
        name: name,
        rfc: rfc,
        street: street,
        streetExt: streetExt,
        streetInt: streetInt,
        zipCode: zipCode,
        suburb: suburb,
        phoneNumber: phoneNumber,
        email: email
      });
      this.customerForm.controls['state'].setValue(state_Id);
      this.customerForm.controls['city'].setValue(city_Id);
      this.getCities(state_Id);
    }
    await this.getStates();
  }

  createCustomer(): void {
    this.userId = this._AESEncryptDecryptService.uid();
    if(this.customerForm.invalid) return;
    const customer = {
      Name: this.formGroup.name.value,
      RFC: this.formGroup.rfc.value,
      Street: this.formGroup.street.value,
      StreetExt: this.formGroup.streetExt.value,
      StreetInt: this.formGroup.streetInt.value,
      ZipCode: this.formGroup.zipCode.value,
      Suburb: this.formGroup.suburb.value,
      PhoneNumber: this.formGroup.phoneNumber.value,
      Email: this.formGroup.email.value,
      City_Id: this.formGroup.city.value,
      State_Id: this.formGroup.state.value,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+"Customers/CreateCustomer",customer).then(data => {
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

  async getCities(stateId:any){
    await this.backEndServices.getCitiesFiltered(stateId).subscribe((res:any) => {this.cities = res})
  }

  async getStates(){
    await this.backEndServices.getStates().subscribe((res:any) => {this.states = res})
  }

  async onStateChanged(){
    await this.getCities(this.customerForm.controls['state'].value);
  }

  updateCustomer(): void {
    this.userId = this._AESEncryptDecryptService.uid();
    const customer = {
      Customer_Id: this.formGroup.customerId.value,
      Name: this.formGroup.name.value,
      RFC: this.formGroup.rfc.value,
      Street: this.formGroup.street.value,
      StreetExt: this.formGroup.streetExt.value,
      StreetInt: this.formGroup.streetInt.value,
      ZipCode: this.formGroup.zipCode.value,
      Suburb: this.formGroup.suburb.value,
      PhoneNumber: this.formGroup.phoneNumber.value,
      Email: this.formGroup.email.value,
      City_Id: this.formGroup.city.value,
      State_Id: this.formGroup.state.value,
      User_Logged: this.userId
    }   
    axios.put(`${environment.API_URL}`+ "Customers/UpdateCustomer",customer).then(data => {
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
