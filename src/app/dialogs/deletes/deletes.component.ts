import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';

@Component({
  selector: 'app-deletes',
  templateUrl: './deletes.component.html',
  styleUrls: ['./deletes.component.scss']
})
export class DeletesComponent implements OnInit {
  title = '';
  message = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeletesComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
    private _AESEncryptDecryptService: AESEncryptDecryptServiceService
  ) { }

  ngOnInit(): void {
    if(this.data.usuario.status === true){
      this.title = "Deshabilitar"
      this.message = "deshabilitar";
    }else{
      this.title = "Habilitar"
      this.message = "habilitar";
    }
  }

  delete( user: any){
    let userId =  this._AESEncryptDecryptService.uid();
    if(user.user_Id !== Number(userId)){
      const tempData = {
        User_Id : user.user_Id,
        Status : user.status,
        User_Logged : userId
      }    
      this.backEndServices.UserPutState(tempData).subscribe((res: any) => {
        if(res.state === 0 ){
          this.dialogRef.close();
          this._snackBar.open(res.message,'',{
            duration:5000,
            horizontalPosition:'right',
            verticalPosition:'top',
            panelClass: ['green-snackbar']
          });
        }else{
          this._snackBar.open(res.message,'',{
            duration:5000,
            horizontalPosition:'right',
            verticalPosition:'top',
            panelClass: ['red-snackbar']
          });
        }
      });
    }else{
      this._snackBar.open('Inicie sesión en un usuario distinto para modificar este registro','',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    }
  }
}
