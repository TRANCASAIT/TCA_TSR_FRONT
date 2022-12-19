import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
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
  userId!: string | null;
  date: Date = new Date();
  
  nameDocument: string = `ReporteSolicitudes_${this.date.toLocaleString()}.xlsx`;
  constructor(public dialog: MatDialog,
    private backEndServices: ServicesBackendService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.setPagination();
  }

  setPagination() {
    this.userId = localStorage.getItem('userId');
    this.backEndServices.getServiceReports().subscribe((res: any) => {
      if (res.numberRecords === 0) {
        this._snackBar.open('No se encontraron registros', '', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
      } else {
        this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.data.length = res.length;
        this.dataObs$ = this.dataSource.connect();
      }
    });
  }

  exportExcel(){
    let element = document.getElementById("table-report");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb, this.nameDocument); 
  }

}
