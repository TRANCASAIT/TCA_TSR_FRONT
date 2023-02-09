import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['folio', 'cliente', 'numCaja', 'operacion', 'stop', 'fecha', 'tmw', 'estatus', 'manifiesto', 'ace', 'layout', 'layoutaceptado', 'aceptadopor', 'cporte', 'xml', 'pdforiginal', 'pdfoperaciones'];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs$!: Observable<any>;
  status:any;
  operationTypes:any;
  userId!: string | null;
  date: Date = new Date();
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  options = this._formBuilder.group({
    numCaja: new FormControl(''),
    folio: new FormControl(''),
    estatusSol: new FormControl(''),
    type: new FormControl('')
  });
  nameDocument: string = `ReporteSolicitudes_${this.date.toLocaleString()}.xlsx`;
  constructor(public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private backEndServices: ServicesBackendService,
    private _snackBar: MatSnackBar,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService,
    ) { }

  ngOnInit(): void {
    this.setPagination();
    this.getStatus();
    this.getOperationTypes();
  }

  async getStatus(){
    await this.backEndServices.getStatuses().subscribe((res:any) => {this.status = res})
  }

  async getOperationTypes(){
    await this.backEndServices.getOperationTypes().subscribe((res:any) => {this.operationTypes = res})
  }

  setPagination() {
    this.userId = this._AESEncryptDecryptService.uid();
    this.backEndServices.getServiceReports().subscribe((res: any) => {
      if (res.numberRecords === 0) {
        this._snackBar.open('No se encontraron registros', '', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      } else {
        this.options.patchValue({
          numCaja:'',
          folio: '',
          estatusSol: '',
          type: '',
        });
        this.range.patchValue({
          start:null,
          end:null
        });
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.data.length = res.length;
        this.dataObs$ = this.dataSource.connect();
      }
    });
  }

  search(){
    //FORM CONTROLS: estatus/type/start/end/folio/numcaja/cliente/prioridad 
    let estatus!:number|null, type!:number|null, start, end, folio!:number|null, numCaja!:string|null
    estatus= Number(this.options.controls['estatusSol'].value);
    type = Number(this.options.controls['type'].value);
    start = this.range.controls['start'].value;
    end=this.range.controls['end'].value;
    folio = Number(this.options.controls['folio'].value);
    numCaja = this.options.controls['numCaja'].value;
    
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
    }
    this.backEndServices.getServiceReportFiltered(obj).subscribe((res: any) => {
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

  convert(str:any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  exportExcel(){
    let element = document.getElementById("table-report");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb, this.nameDocument); 
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;   
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
