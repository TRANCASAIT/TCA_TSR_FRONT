import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public comment :any,
    public dialogRef: MatDialogRef<CommentComponent>,
    private _snackBar: MatSnackBar,
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
  }

  saveComment(){
    this.userId = localStorage.getItem('User_Id');
    let comment = {
      ServiceRequest_Id: this.formGroup.serviceRequest_Id.value,
      Document_Id: this.formGroup.documentId.value,
      Consigment_Note: this.formGroup.comment.value,
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
      console.log(error);
      
      this._snackBar.open(error,'',{
        duration:5000,
        horizontalPosition:'right',
        verticalPosition:'top',
        panelClass: ['red-snackbar']
      });
    });
    
  
  }

}
