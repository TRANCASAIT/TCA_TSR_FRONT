import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import axios from 'axios';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  dataSource !: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; 
  dataObs$!: Observable<any>;
  rol1= environment.UserRoles.Rol1;
  rol2= environment.UserRoles.Rol2;
  rol3= environment.UserRoles.Rol3;
  rol4= environment.UserRoles.Rol4;
  rol5=environment.UserRoles.Rol5;
  displayedColumns: string[] = ['descargar','remover']
  userId!: string|null;
  options: any;
  dataDoc : any;
  userRole!: string|null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public option :any,
    public dialogRef: MatDialogRef<OptionsComponent>,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem("ROLE");
    const { typeNumber, invoiceMX, invMXFN, serviceRequest_Id, document_Id,
      invoiceUSA, invUSAFN, bol, bolFN, inward, inwFN, ace, aceFN, layout, layoutFN,
      xml, xmlFN, originalPDF, oPdfFN, operationsPDF, opPdfFN, accepted_LayoutDC, status_Id} = this.option;
      this.dataDoc = [{
        sr: serviceRequest_Id,
        document_Id: document_Id,
        status_Id: status_Id
      }]
    if(typeNumber === 1){
      this.dataDoc[0].url = invoiceMX;
      this.dataDoc[0].fileName = invMXFN;
      this.dataDoc[0].documentType = typeNumber;
    }else if(typeNumber === 2){
      this.dataDoc[0].url = invoiceUSA;
      this.dataDoc[0].fileName = invUSAFN;
      this.dataDoc[0].documentType = typeNumber;
    }else if(typeNumber === 3){
      this.dataDoc[0].url = bol;
      this.dataDoc[0].fileName = bolFN;
      this.dataDoc[0].documentType = typeNumber;
    }else if(typeNumber === 4){
      this.dataDoc[0].url = inward;
      this.dataDoc[0].fileName = inwFN;
      this.dataDoc[0].documentType = typeNumber;
    }else if(typeNumber === 5){
      this.dataDoc[0].url = ace;
      this.dataDoc[0].fileName = aceFN;
      this.dataDoc[0].documentType = typeNumber;
    }else if(typeNumber === 6){
      this.dataDoc[0].url = layout;
      this.dataDoc[0].fileName = layoutFN;
      this.dataDoc[0].documentType = typeNumber;
      this.dataDoc[0].accepted_LayoutDC = accepted_LayoutDC;
    }else if(typeNumber === 7) {
      this.dataDoc[0].url = xml;
      this.dataDoc[0].fileName = xmlFN;
      this.dataDoc[0].documentType = typeNumber;
    }else if(typeNumber === 8){
      this.dataDoc[0].url = originalPDF;
      this.dataDoc[0].fileName = oPdfFN;
      this.dataDoc[0].documentType = typeNumber;
    }else if(typeNumber === 9){
      this.dataDoc[0].url = operationsPDF;
      this.dataDoc[0].fileName = opPdfFN;
      this.dataDoc[0].documentType = typeNumber;
    }
    this.dataSource = new MatTableDataSource<any>(this.dataDoc);
    this.dataSource.paginator = this.paginator;
    this.dataSource.data.length = this.dataDoc.length;
    this.dataObs$ = this.dataSource.connect();
  }
downloadFile(url:any, fileName:any, sr:any, documentType:number){
    if(((documentType <= 4 || documentType === 6) && this.userRole === this.rol4 || this.userRole === this.rol5 || this.userRole === this.rol2) || (documentType === 5 && (this.userRole === this.rol2 || this.userRole === this.rol3 || this.userRole === this.rol4)) || 
    (documentType >= 7 && documentType <= 9 && (this.userRole === this.rol2 || this.userRole === this.rol4))){
      let obj = {
        url: url
      }
      axios({
        url: `${environment.API_URL}ServiceRequests/DownloadFile`, //your url
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
        this._snackBar.open('Archivo descargado','',{
          duration:4000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
      }).catch(error =>{
        this._snackBar.open('El archivo no fue descargado','',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
      });
    }else{
      this._snackBar.open('No se puede realizar esta acción','',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    }
  }

  removeFile(sr:number, dc:number, documentType:number, url:string, fileName:string, status:number){
    this.userId = localStorage.getItem('User_Id');
    if(((documentType <= 4 || documentType === 6) && (this.userRole === this.rol4 || this.userRole === this.rol5) && (status !== 5)) || (documentType === 5 && (this.userRole === this.rol2 || this.userRole === this.rol3) && (status !== 5)) || 
    (documentType >= 7 && documentType <= 9 && (this.userRole === this.rol2) && (status !== 5)))
    {
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
        this._snackBar.open(error,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
      });
    }else{
      this._snackBar.open('No se puede realizar esta acción','',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    }
  }
}
