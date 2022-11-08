import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import axios from 'axios';
import { NumeroCporteComponent } from '../numero-cporte/numero-cporte.component';
import { environment } from 'src/environments/environment';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
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
  progress = 0;
  message = '';
  folio: number = 0;

  dataSource !: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 
  dataObs$!: Observable<any>;
  fileInfos?: Observable<any>;

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

  displayedColumns: string[] = ['stop','estatus','factMX','factUS','BOL','InwardManif','ACE','layout','layoutAcep','NumCartPorte','XML','PDFOrig','PDFOper','comentarios'];


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
    private _snackBar: MatSnackBar, private uploadService: FileUploadService,
    @Inject(MAT_DIALOG_DATA) public sr :any,
    public dialogRef: MatDialogRef<NumeroCporteComponent>,
    ) { }

  ngOnInit(): void {
    this.setPagination(this.sr.sr);
  }

  uploadFile(el:any, fileType:any){
    this.userId = localStorage.getItem('User_Id');
    el.userId = this.userId;
    el.fileType = fileType;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.upload(this.currentFile, el).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
            this.setPagination(el.serviceRequest_Id);
          },
          error: (err: any) => {
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'El archivo no fue subido!';
            }
            this.currentFile = undefined;
          }
        });
      }
      this.selectedFiles = undefined;
    }
  }

  setPagination(elem:any) {
    this.userId = localStorage.getItem('User_Id');
    this.backEndServices.getServiceRequestsDocuments(elem).subscribe((res: any) => {
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
      console.log(res);
      
      }
    });
  }

  downloadFile(url:any, fileName:any, sr:any){
    let obj = {
      url: url
    }
    axios({
      url: 'https://localhost:7014/api/ServiceRequests/DownloadFile', //your url
      method: 'POST',
      data: obj,
      responseType: 'blob',
      // important
    }).then((response) => {
      const href = URL.createObjectURL(response.data);
      // create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', fileName); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      this.setPagination(sr);
    }).catch(error =>{
    });
  }

  removeFile(sr:number, dc:number, documentType:number, url:string, fileName:string){
    this.userId = localStorage.getItem('User_Id');
    let document = {
      ServiceRequest_Id: sr,
      Document_Id: dc,
      Document_Type: documentType,
      Url: url,
      FileName: fileName,
      User_Logged: this.userId
    }
    axios.post(`${environment.API_URL}`+ "ServiceRequests/RemoveFile",document).then(data => {
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
      console.log(error);
      
      this._snackBar.open(error,'',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    });
    
  }

  setCartaPorte(obj: any) {
    obj.type = 'new';
    //console.log(obj);
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '25%';
    dialogConfig.maxWidth = '70vw';
    dialogConfig.data = obj;
    dialogConfig.panelClass = '';
    const dialogRef = this.dialog.open( NumeroCporteComponent  , dialogConfig);
    dialogRef.afterClosed().toPromise().then(() => this.setPagination(obj.serviceRequest_Id));
  }
}
