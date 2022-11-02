import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators, FormBuilder, UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Observable, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {


  clientList: any = [];

  /** control for the selected item */
  public clientCtrl: UntypedFormControl = new UntypedFormControl();
    
  /** control for the MatSelect filter keyword */
  public clientFilterCtrl: UntypedFormControl = new UntypedFormControl();
      
  /** list of items filtered by search keyword */

  public filteredClient: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect3', { static: true })
  singleSelect3!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public newUser :any,
    private backEndServices : ServicesBackendService,
    public dialogRef: MatDialogRef<UsuarioComponent>,
    private _snackBar: MatSnackBar,
    private FormBuilder: FormBuilder
  ) { }


  userTypeList: any = [];
  terminals: any;
  WorkShifts: any;
  show:boolean = false;
  type: string | undefined;
  userTypes$ : Observable<Array<any>> | undefined;  
  nickName: string | undefined;
  disabled = false;
  disabledEmail = true;
  submitted = false;
  userId!: string|null;
  userTypeAuthorized = false;
  formNewUser: FormGroup = new FormGroup(
    {
      names       : new FormControl(''),
      lastnames   : new FormControl(''),
      email       : new FormControl(''),
      username    : new FormControl(''),
      password    : new FormControl(''),
      confirmPassword : new FormControl(''),
      userType    : new FormControl(''),
      clients : new FormControl(''),
      user_Id: new FormControl(0)
    }
  )
 
 async  ngOnInit() {

  await this.getCustomers();

    this.userId = localStorage.getItem('userId');
    this.type = this.newUser.type;

    if (this.type === 'edit') {
      const {  userName, userType_Id, name,
        email, user_Id,  last_Name, user_Name, user_Number } = this.newUser.usuario;
        this.formNewUser.controls['userType'].setValue(userType_Id);
        this.formNewUser.patchValue({
          username: userName,
          email: email,
          names: name,
          lastnames: last_Name,
          user_Id: user_Id
        });
        if(userType_Id === 1 || userType_Id === 2){
          this.formNewUser.patchValue({
            email: email
          })
        }
        
    }else if (this.type !== 'edit') {
    this.formNewUser = this.FormBuilder.group({
        names: ['', Validators.required],
        lastnames: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['',[ Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        confirmPassword: ['', Validators.required],
        userType: ['', Validators.required],
        clients: ['', Validators.required],
        user_Id: [0]
        
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
      
    );
    this.type = this.newUser.type;
    }
    await this.getUserType();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formNewUser.controls;
  }

  createNewUser(): void {
    this.submitted = true;
    this.userId = localStorage.getItem('userId');
    if (this.formNewUser.invalid) {
      return;
    }

    //Create Json Object per APi.
    let tempUserObject = { 
      UserName: this.formNewUser.controls['username'].value,
      name: this.formNewUser.controls['names'].value,
      userType_Id: this.formNewUser.controls['userType'].value,
      customer_Id: this.formNewUser.controls['clients'].value,
      email: this.formNewUser.controls['email'].value,
      last_Name: this.formNewUser.controls['lastnames'].value,
      password: this.formNewUser.controls['password'].value,
      User_Logged: 'NAAA'
    }    
    
    // Sent information to api
    this.backEndServices.InsertUser(tempUserObject).subscribe((response: any) => { 

      if (response['state'] === 0){
        this._snackBar.open(response['message'],'',{
          duration:5000,
          horizontalPosition:'center',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
        this.formNewUser.reset();
        this.dialogRef.close();
      }else if (response['state'] === 1){
        this._snackBar.open(response['message'],'',{
          duration:5000,
          horizontalPosition:'center',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
      }
    },(error: any) => {
      this._snackBar.open(error,'',{
        duration:10000,
        horizontalPosition:'center',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      })

    });
  }

  editUser(): void {
    if (this.formNewUser.invalid) {
      return;
    }
    this.userId = localStorage.getItem('userId');

    //Create Json Object per APi.
    let tempUserObject = { 
      User_Id: this.formNewUser.controls['user_Id'].value, 
      UserName: this.formNewUser.controls['username'].value,
      name: this.formNewUser.controls['names'].value,
      UserType_Id: Number(this.formNewUser.controls['userType'].value),
      email: this.formNewUser.controls['email'].value,
      customer_Id: this.formNewUser.controls['clients'].value,
      last_Name: this.formNewUser.controls['lastnames'].value,
      Password: this.formNewUser.controls['password'].value,
      User_Logged: 'na' //this.userId
    }        
    if(tempUserObject.UserType_Id === 3){
      tempUserObject.email = 'NA';
    }
    
    //Sent information to api
    this.backEndServices.UpdateUser(tempUserObject).subscribe((response: any) => { 

      if (response['state'] === 0){
        this._snackBar.open(response['message'],'',{
          duration:5000,
          horizontalPosition:'center',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
        this.formNewUser.reset();
        this.dialogRef.close();
      }
    },(error: any) => {
      this._snackBar.open(error,'',{
        duration:10000,
        horizontalPosition:'center',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      })
    });
  }
  async getUserType(){
    await  this.backEndServices.getUserTypes().subscribe(( userType : any ) => { this.userTypeList = userType });
  }

  getUserName(){
    let name = this.formNewUser.controls['names'].value?.substring(0,3).toLowerCase();
    let lastName = this.formNewUser.controls['lastnames'].value?.substring(0,3).toLowerCase();
    let number = Math.floor(Math.random() * 99);
    let nickname = name! + lastName! + number;

    //Add value to user name form control.
    this.formNewUser.controls['username'].setValue(nickname);

    return this.nickName = nickname;

  }

  async getCustomers(){
    this.backEndServices.getCustomers().subscribe((responsables: any) => { 
      if(responsables.length > 0 && responsables.numberRecords !== 0){
        this.clientList = responsables
        this.clientCtrl.setValue(this.clientList[4]);
        this.filteredClient.next(this.clientList.slice());
        this.clientFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterClient(); 
          });
      }
    });
  }

  /**
   * Sets the initial value after the filteredCompanies are loaded initially
   */
  protected setInitialValue() {
      this.filteredClient
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {       
        this.singleSelect3.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  protected filterClient(){
    if (!this.clientList){
      return;
    }
    let search = this.clientFilterCtrl.value;
    if(!search){
      this.filteredClient.next(this.clientList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClient.next(
      this.clientList.filter((client: { name: string; }) => client.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
