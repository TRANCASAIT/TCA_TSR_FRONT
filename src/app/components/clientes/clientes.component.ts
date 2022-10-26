import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import axios from 'axios';
import { Observable } from 'rxjs';
import { ClienteComponent } from 'src/app/dialogs/cliente/cliente.component';
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
  constructor(public dialog : MatDialog, 
    private backEndServices : ServicesBackendService,
    private _snackBar: MatSnackBar,) { }

  async ngOnInit() {
    this.setPagination();
  }
  openDialog(obj:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = obj;
  
    dialogConfig.panelClass = '';
  
    const dialogRef = this.dialog.open( ClienteComponent  , dialogConfig);
  
    dialogRef.afterClosed().toPromise().then(() => this.setPagination());
  }

  setPagination() {
    this.userId = localStorage.getItem('userId');
    this.backEndServices.getCustomers().subscribe((res: any) => {
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

  ChangeState(element: any){    
    this.userId = localStorage.getItem('userId');   
    element.user_Logged = this.userId;    
    axios.put(`${environment.API_URL}`+"Customers/CustomerPutState",element).then(data => {            
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
    })
  }

}
