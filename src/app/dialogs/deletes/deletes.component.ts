import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';

@Component({
  selector: 'app-deletes',
  templateUrl: './deletes.component.html',
  styleUrls: ['./deletes.component.scss']
})
export class DeletesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeletesComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService

  ) { }

  ngOnInit(): void {

  }

  delete( user: any){
    let userId = localStorage.getItem("User_Id");
    const tempData = {
      User_Id : user.user_Id,
      Status : user.status,
      User_Logged : userId
    }
    this.backEndServices.UserPutState(tempData).subscribe((res: any) => {
      if(res.state === 0 ){
        this._snackBar.open('Usuario eliminado correctamente.','',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
        this.dialogRef.close();
      }else{
        this._snackBar.open(res.message,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });
      }
    });
    
  }
}
