import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TipoUsuarioComponent } from 'src/app/dialogs/tipo-usuario/tipo-usuario.component';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';

@Component({
  selector: 'app-tipos-usuarios',
  templateUrl: './tipos-usuarios.component.html',
  styleUrls: ['./tipos-usuarios.component.scss']
})
export class TiposUsuariosComponent implements OnInit {
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['stops','editar'];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs$!: Observable<any>;
  userId!: string|null;
  constructor(public dialog : MatDialog, 
    private backEndServices : ServicesBackendService,
    private _snackBar: MatSnackBar,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService,
    ) { }

  async ngOnInit() {
    this.setPagination();
  }
  openDialog(obj:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = obj;
  
    dialogConfig.panelClass = '';
  
    const dialogRef = this.dialog.open( TipoUsuarioComponent  , dialogConfig);
  
    dialogRef.afterClosed().toPromise().then(() => this.setPagination());
  }

  setPagination() {
    this.userId = this._AESEncryptDecryptService.uid();
    const utp = 1;
    this.backEndServices.getUserTypes(utp).subscribe((res: any) => {
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
}
