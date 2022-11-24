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
import { SolicitudComponent } from 'src/app/dialogs/solicitud/solicitud.component';
import { TmwOrderComponent } from 'src/app/dialogs/tmw-order/tmw-order.component';
import { UploadFileComponent } from 'src/app/dialogs/upload-file/upload-file.component';
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
  rol2= environment.UserRoles.Rol2;
  rol3= environment.UserRoles.Rol3;
  rol4= environment.UserRoles.Rol4;
  userRole!: string|null;

  dataSource !: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 
  dataObs$!: Observable<any>;
  status:any;
  operationTypes:any;
  customers:any;

  selectFile(event: any, elem:any): void {
    this.selectedFiles = event.target.files;
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    if(value === "facMx" + elem){
      var el = document.getElementById("btnFacMX" + elem);
      el!.style.display ='contents';
    }else if(value === "facUsa" + elem){      
      var el = document.getElementById("btnFacUSA" + elem);
      el!.style.display ='contents';
    }else if(value === "bol"+ elem){
      var el = document.getElementById("btnBol" + elem);
      el!.style.display ='contents';
    }else if(value === "inwd"+ elem){
      var el = document.getElementById("btnInwd" + elem);
            el!.style.display ='contents';
    }else if(value === "ace"+ elem){
      var el = document.getElementById("btnAce" + elem);
            el!.style.display ='contents';
    }else if(value === "layout"+ elem){
      var el = document.getElementById("btnLayout" + elem);
            el!.style.display ='contents';
    }else if(value === "xml"+ elem){
      var el = document.getElementById("btnXml" + elem);
            el!.style.display ='contents';
    }else if(value === "oriPDF"+ elem){
      var el = document.getElementById("btnOriPDF" + elem);
            el!.style.display ='contents';
    }else if(value === "opPDF"+ elem){
      var el = document.getElementById("btnOpPDF" + elem);
            el!.style.display ='contents';
    }
  }

  displayedColumns: string[] = ['prioridad', 'folio', 'cliente','numCaja','tipoOp','stops','fechaHora','ordTMW','estatus',
                               'upload','delete'];
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  options = this._formBuilder.group({
    numCaja: new FormControl(''),
    folio: new FormControl(''),
    estatus: new FormControl(''),
    type: new FormControl(''),
    cliente: new FormControl(''),
    prioridad: false
  });

  matcher = new MyErrorStateMatcher();

  constructor(private _formBuilder: FormBuilder, public dialog : MatDialog,
    private backEndServices : ServicesBackendService,
    private _snackBar: MatSnackBar,
    ) { }

  async ngOnInit(){
    this.setPagination();
    this.getStatus();
    this.getOperationTypes();
    this.getCustomers();
    this.userRole = localStorage.getItem("ROLE");
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
    if((this.userRole === this.rol2 || this.userRole === this.rol4) && (obj.status_Id != 5)){
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
  
  setPagination() {
    this.userId = localStorage.getItem('User_Id');
    this.backEndServices.getServiceRequests().subscribe((res: any) => {
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

  async getStatus(){
    await this.backEndServices.getStatuses().subscribe((res:any) => {this.status = res})
  }

  async getOperationTypes(){
    await this.backEndServices.getOperationTypes().subscribe((res:any) => {this.operationTypes = res})
  }

  async getCustomers(){
    await this.backEndServices.getCustomersActive().subscribe((res:any) => {this.customers = res})
  }

  removeService(sr:number, status: number){
    if((this.userRole === this.rol2 || this.userRole === this.rol4) && (status != 5)){
      axios.put(`${environment.API_URL}`+ `ServiceRequests/RemoveServiceRequest/${sr}`).then(data=> {
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
    if((this.userRole === this.rol2 || this.userRole === this.rol4) && (status != 5)){
      this.userId = localStorage.getItem('User_Id');
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

  search(){
    console.log('search');
  }

  edit( _element: any ){
    console.log('update', _element);
  }



}
