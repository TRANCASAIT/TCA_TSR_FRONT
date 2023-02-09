import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import axios from 'axios';
import { Observable } from 'rxjs';
import { BoxNumberComponent } from 'src/app/dialogs/box-number/box-number.component';
import { OperationTypeComponent } from 'src/app/dialogs/operation-type/operation-type.component';
import { SolicitudComponent } from 'src/app/dialogs/solicitud/solicitud.component';
import { TmwOrderComponent } from 'src/app/dialogs/tmw-order/tmw-order.component';
import { UploadFileComponent } from 'src/app/dialogs/upload-file/upload-file.component';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import { environment } from 'src/environments/environment';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})

export class SolicitudesComponent implements OnInit {
  userId!: string|null;
  selectedFiles?: FileList;
  currentFile?: File;
  btnFacMX = "btnFacMX";
  facUsa = false;
  bol = false;
  inwd = false;
  ace = false;
  layout = false;
  xml = false;
  oriPDF = false;
  opPDF = false;
  rol1= environment.UserRoles.Rol1;
  rol2= environment.UserRoles.Rol2;
  rol3= environment.UserRoles.Rol3;
  rol4= environment.UserRoles.Rol4;
  rol5= environment.UserRoles.Rol5;
  userRole!: string|null;
  customerValue= 0;
  dataSource !: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 
  dataObs$!: Observable<any>;
  status:any;
  operationTypes:any;
  customers:any;
  showAddSRButton = false;

  displayedColumns: string[] = ['prioridad', 'folio', 'cliente','numCaja','tipoOp','stops','fechaHora','ordTMW','estatus',
                               'upload','delete'];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  options = this._formBuilder.group({
    numCaja: new FormControl(''),
    folio: new FormControl(''),
    estatusSol: new FormControl(''),
    type: new FormControl(''),
    cliente: new FormControl(''),
    prioridad: false
  });

  matcher = new MyErrorStateMatcher();

  constructor(private _formBuilder: FormBuilder, public dialog : MatDialog,
    private backEndServices : ServicesBackendService,
    private _snackBar: MatSnackBar,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService
    ) { }

  async ngOnInit(){
    this.userId = this._AESEncryptDecryptService.uid();
    this.setPagination();
    this.getStatus();
    this.getOperationTypes();
    this.userRole = this._AESEncryptDecryptService.urol();
    if((this.userRole === environment.UserRoles.Rol4) || (this.userRole === environment.UserRoles.Rol5)){
      this.showAddSRButton = true;
    }
  }

  uploadFileDialog(obj:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85%';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = obj;
    obj.type = 'new';
    dialogConfig.panelClass = '';
    const dialogRef = this.dialog.open( UploadFileComponent  , dialogConfig);
    dialogRef.afterClosed().toPromise().then(() => this.setPagination());
  }

  convert(str:any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  setTMW(obj: any) {
      if(this.userRole === this.rol2 || this.userRole === this.rol3){
      obj.type = 'new';
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '25%';
      dialogConfig.maxWidth = '70vw';
      dialogConfig.data = obj;
      dialogConfig.panelClass = '';
      const dialogRef = this.dialog.open( TmwOrderComponent  , dialogConfig);
      dialogRef.afterClosed().toPromise().then(() => this.setPagination());
    }
  }

  boxNumber(obj: any) {
    if((this.userRole === this.rol4 || this.userRole === this.rol5) && (obj.status_Id != 5)){
    obj.type = 'new';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '25%';
    dialogConfig.maxWidth = '70vw';
    dialogConfig.data = obj;
    dialogConfig.panelClass = '';
    const dialogRef = this.dialog.open( BoxNumberComponent  , dialogConfig);
    dialogRef.afterClosed().toPromise().then(() => this.setPagination());
    }
  }

  openDialog(obj:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = obj;
    dialogConfig.panelClass = '';
    const dialogRef = this.dialog.open( SolicitudComponent  , dialogConfig);
    dialogRef.afterClosed().toPromise().then(() => this.setPagination());
  }
  
  async setPagination() {
    this.userId = this._AESEncryptDecryptService.uid()
    this.backEndServices.getServiceRequests(this.userId).subscribe((res: any) => {
      if(res.numberRecords === 0 ){
        this._snackBar.open('No se encontraron registros','',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
        this.setToNull();
        this.dataSource = new MatTableDataSource<any>(res);
      }else{
      this.setToNull();
      this.dataSource = new MatTableDataSource<any>(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.data.length = res.length;
      this.dataObs$ = this.dataSource.connect();
      }
      this.getCustomers();
    });
  }

  setToNull():any{
    this.options.patchValue({
      numCaja:'',
      folio: '',
      estatusSol: '',
      type: '',
      cliente: '',
      prioridad: false
    });
    this.range.patchValue({
      start:null,
      end:null
    });
  }

  async getStatus(){
    await this.backEndServices.getStatuses().subscribe((res:any) => {this.status = res})
  }

  async getOperationTypes(){
    await this.backEndServices.getOperationTypes().subscribe((res:any) => {this.operationTypes = res})
  }

  async getCustomers(){
    if(this.userRole === this.rol1 || this.userRole === this.rol2 || this.userRole === this.rol3){
      await this.backEndServices.getCustomersActive().subscribe((res:any) => {this.customers = res})
    }else{
      await this.backEndServices.getCustomersActiveCustomer(this.userId).subscribe((res:any) => {
        this.customers = res;
        this.options.patchValue({
          cliente: res[0].customer_Id
        });
        //var results = res.filter(function (reses:any) { return reses.customer_Id == customer; });
      });
    }
  }

  removeService(sr:number, status: number){
    if((this.userRole === this.rol2 || this.userRole === this.rol4) && (status != 5)){
      let removeService = {
        User_Logged: this.userId,
        ServiceRequest_Id : sr
      }
      axios.put(`${environment.API_URL}`+ `ServiceRequests/RemoveServiceRequest`,removeService).then(data=> {
        if(data.data.state === 0){
          this._snackBar.open(data.data.message,'',{
            duration:5000,
            horizontalPosition:'right',
            verticalPosition:'top',
            panelClass: ['green-snackbar']
          });
          this.setPagination();
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
    }else{
      this._snackBar.open('No puede realizar esta accion','',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    }
  }

  changePriority(sr:number, priority:boolean, status:number){
    if((this.userRole === this.rol2) && (status != 5)){
      this.userId = this._AESEncryptDecryptService.uid();
      let Service = {
        ServiceRequest_Id: sr,
        Priority: priority,
        User_Logged: this.userId
      }
      axios.put(`${environment.API_URL}`+ `ServiceRequests/PrioritizeRequest`, Service).then(data=> {
        if(data.data.state === 0){
          this._snackBar.open(data.data.message,'',{
            duration:5000,
            horizontalPosition:'right',
            verticalPosition:'top',
            panelClass: ['green-snackbar']
          });
          this.setPagination();
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
    }else{
      this._snackBar.open('No puede realizar esta accion','',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    }
  }

  changeOperationType(obj:any){
    if((this.userRole === this.rol4 || this.userRole === this.rol5) && (obj.status_Id < 2)){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '40%';
      obj.type = 'edit';
      dialogConfig.maxWidth = '50vw';
      dialogConfig.data = obj;
      dialogConfig.panelClass = '';
      const dialogRef = this.dialog.open( OperationTypeComponent  , dialogConfig);
      dialogRef.afterClosed().toPromise().then(() => this.setPagination());
    }
  }

  search(){
    //FORM CONTROLS: estatus/type/start/end/folio/numcaja/cliente/prioridad 
    let estatus!:number|null, type!:number|null, start, end, folio!:number|null, numCaja!:string|null, cliente!:number|null, prioridad!:boolean|null;
    estatus= Number(this.options.controls['estatusSol'].value);
    type = Number(this.options.controls['type'].value);
    start = this.range.controls['start'].value;
    end=this.range.controls['end'].value;
    folio = Number(this.options.controls['folio'].value);
    numCaja = this.options.controls['numCaja'].value;
    cliente = Number(this.options.controls['cliente'].value);
    prioridad = this.options.controls['prioridad'].value;
    if(start === null){
      start=''
    }else{
      start = this.convert(start);
    }

    if(end=== null){
      end=''
    }else{
      end = this.convert(end);
    }
    let obj = {
      Status_Id: estatus,
      OperationType_Id: type,
      StartDate: start,
      EndDate: end,
      InvoiceNumber: folio,
      Box_Number: numCaja,
      Customer_Id: cliente,
      Priority: prioridad,
      User_Id: this.userId
    }
    this.backEndServices.getServiceRequestsFiltered(obj).subscribe((res: any) => {
      if(res.numberRecords === 0 ){
        this._snackBar.open('No se encontraron registros','',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
      }else{
      this.dataSource = new MatTableDataSource<any>(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.data.length = res.length;
      this.dataObs$ = this.dataSource.connect();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;   
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
