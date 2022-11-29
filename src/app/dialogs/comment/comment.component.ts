import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import axios from 'axios';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import { environment } from 'src/environments/environment';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  comments:any;
  commentsList:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public comment :any,
    public dialogRef: MatDialogRef<CommentComponent>,
    private _snackBar: MatSnackBar,
    private backEndServices : ServicesBackendService,
  ) { }
  matcher = new MyErrorStateMatcher();
  type: string | undefined;
  commentForm = new FormGroup({
    serviceRequest_Id: new FormControl(0),
    documentId: new FormControl(0),
    comment: new FormControl('', [Validators.required]),
  });
  userId!: string|null;
  show:boolean = false;
  get formGroup() { return this.commentForm.controls; }

  ngOnInit(): void {
    this.type = this.comment.type;
    const {serviceRequest_Id, document_Id} = this.comment;
    this.commentForm.patchValue({
      serviceRequest_Id: serviceRequest_Id,
      documentId: document_Id
    });
    this.setPagination(document_Id);
  }

  saveComment(){
    this.userId = localStorage.getItem('User_Id');

    let comment = {
      ServiceRequest_Id: this.formGroup.serviceRequest_Id.value,
      Document_Id: this.formGroup.documentId.value,
      Comment_Body: this.formGroup.comment.value,
      User_Logged: this.userId
    }

    axios.post(`${environment.API_URL}`+ "ServiceRequests/sendComment",comment).then(data => {
      if(data.data.state === 0){
        this._snackBar.open(data.data.message,'',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['green-snackbar']
        });
        this.dialogRef.close(); 
        this.setPagination(comment.Document_Id);
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
  }

  setPagination(doc:any) {
    this.userId = localStorage.getItem('userId');
    this.backEndServices.getComments(doc).subscribe((res: any) => {
      if(res.numberRecords === 0 ){
        this._snackBar.open('Sin comentarios registrados','',{
          duration:5000,
          horizontalPosition:'right',
          verticalPosition:'top',
          panelClass: ['red-snackbar']
        });        
      }else{
        this.commentsList = res;
      }
    });
  }
}
