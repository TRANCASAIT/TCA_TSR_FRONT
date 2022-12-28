import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import axios from 'axios';
import { Observable } from 'rxjs';
import { DeletesComponent } from 'src/app/dialogs/deletes/deletes.component';
import { UsuarioComponent } from 'src/app/dialogs/usuario/usuario.component';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  dataSource !: MatTableDataSource<any>
  displayedColumns: string[] = ['usuario','nombre','tipo','cliente', 'correo','habilitado','sesion','creacion', 'editar'];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs$!: Observable<any>;
  userId!: string|null;
  userRole = localStorage.getItem('ROLE');

  constructor( public dialog: MatDialog, private backEndServices: ServicesBackendService, private _snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.setPagination();
    this.userId = localStorage.getItem('userId');
  }

  openDialog(obj:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = obj;
  
    dialogConfig.panelClass = '';
  
    const dialogRef = this.dialog.open( UsuarioComponent  , dialogConfig);
    dialogRef.afterClosed().toPromise().then(() => this.setPagination());
  }

  DeleteUserDialog(obj:any): void { 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '15%';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = obj; 
    dialogConfig.panelClass = '';

    const dialogRef = this.dialog.open (DeletesComponent, dialogConfig);
    dialogRef.afterClosed().toPromise().then(() => this.setPagination());

  } 

  LogOutUser(user:number): void
  {
    if(user !== Number(this.userId))
      {
        if(this.userRole === environment.UserRoles.Rol1){
          axios.post(`${environment.API_URL}Users/LogOut/${user}`).then(data=>{
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
          }).catch(error =>{
            this._snackBar.open(error,'',{
              duration:5000,
              horizontalPosition:'right',
              verticalPosition:'top',
              panelClass: ['red-snackbar']
            });
          })
      }
    }
  }

  setPagination() {
    this.userId = localStorage.getItem('userId');
    this.backEndServices.getUsers().subscribe((res: any) => {
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
