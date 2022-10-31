import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { SolicitudComponent } from 'src/app/dialogs/solicitud/solicitud.component';
import { UploadFileComponent } from 'src/app/dialogs/upload-file/upload-file.component';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';

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

  dataSource !: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 
  dataObs$!: Observable<any>;


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

  uploadFile(el:any, fileType:any){
    console.log(el);
    const { serviceRequest_Id, document_Id, stop_Number } = el;
    console.log(serviceRequest_Id, document_Id, stop_Number);
    
    console.log(fileType);
    
  }

  displayedColumns: string[] = ['prioridad', 'folio', 'cliente','numCaja','tipoOp','stops','fechaHora','ordTMW',
                               'upload','edit','delete'];
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

  ngOnInit(): void {
    this.setPagination();
  }

  uploadFileDialog(obj:any): void {
    //this.common.spinner.show();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = obj;
  
    dialogConfig.panelClass = '';
  
    const dialogRef = this.dialog.open( UploadFileComponent  , dialogConfig);
  
    dialogRef.afterClosed().toPromise().then(() => this.setPagination());
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
    this.userId = localStorage.getItem('userId');
    this.backEndServices.getServiceRequests().subscribe((res: any) => {
      if(res.numberRecords === 0 ){
        this._snackBar.open('No se encontraron registros','',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
        console.log(res);
        
      }else{
      this.dataSource = new MatTableDataSource<any>(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.data.length = res.length;
      this.dataObs$ = this.dataSource.connect();
      }
    });
  }

  search(){
    console.log('search');
  }

  add(){
    console.log('add');
  }

  edit( _element: any ){
    console.log('update', _element);
  }

  delete( _folio: number ){
    console.log('delete', _folio);
  }

  pdfclick( _id: any ){

  }


}
