import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import axios from 'axios';
import { Observable } from 'rxjs';
import { ClienteComponent } from 'src/app/dialogs/cliente/cliente.component';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['cliente','rfc','direccion', 'telefono', 'estado', 'ciudad', 'email', 'status', 'editar'];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs$!: Observable<any>;
  userId!: string|null;
  userRole!: string|null;
  utp = 0;
  rol1= environment.UserRoles.Rol1;
  rol2= environment.UserRoles.Rol2;
  rol3= environment.UserRoles.Rol3;
  rol4= environment.UserRoles.Rol4;
  rol5=environment.UserRoles.Rol5;
  constructor(public dialog : MatDialog, 
    private backEndServices : ServicesBackendService,
    private _snackBar: MatSnackBar,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService
    ) { }

  async ngOnInit() {
    this.setPagination();
    this.userRole = this._AESEncryptDecryptService.urol();
  }
  openDialog(obj:any): void {
    if(this.userRole === this.rol1 || this.userRole === this.rol2){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '60%';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.data = obj;
      dialogConfig.panelClass = '';
    
      const dialogRef = this.dialog.open( ClienteComponent  , dialogConfig);
    
      dialogRef.afterClosed().toPromise().then(() => this.setPagination());
    }else{
      this._snackBar.open('No se puede realizar esta acción','',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    }
  }

  setPagination() {
    this.userId = this._AESEncryptDecryptService.uid();
    this.utp = 1;
    this.backEndServices.getCustomers(this.utp).subscribe((res: any) => {
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

  ChangeState(element: any){    
    //roles de usuarios 
    if(this.userRole === this.rol1 || this.userRole === this.rol2){
        this.userId = this._AESEncryptDecryptService.uid();
        const {customer_Id, status} = element;
        let customer = {
          Customer_Id: customer_Id,
          Status: status,
          User_Logged:  this.userId
        }    
        axios.put(`${environment.API_URL}Customers/CustomerPutState`,customer).then(data => {            
          if(data.data.state===0){
            this._snackBar.open(data.data.message,'',{
              duration:5000,
              horizontalPosition:'right',
              verticalPosition:'top',
              panelClass: ['green-snackbar']
            });
        }else if(data.data.state === 1){
          this._snackBar.open(data.data.message,'',{
            duration:5000,
            horizontalPosition:'right',
            verticalPosition:'top',
            panelClass: ['red-snackbar']
          });
        }  
        this.setPagination();
        }).catch(error => {
        this._snackBar.open(error.message,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
        });
      }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
