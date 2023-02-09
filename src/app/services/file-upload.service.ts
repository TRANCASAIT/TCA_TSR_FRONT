import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  upload(file: File, el:any): Observable<HttpEvent<any>> {
    const {serviceRequest_Id, document_Id, stop_Number, userId, fileType} = el;
    const formData: FormData = new FormData();
    environment.API_URL
    formData.append('documentFile', file);
    formData.append('ServiceRequest_Id', serviceRequest_Id.toString());
    formData.append('Document_Id', document_Id.toString());
    formData.append('Stop_Number', stop_Number.toString());
    formData.append('Document_Type', fileType.toString());
    formData.append('User_Logged', userId.toString());

    const req = new HttpRequest(
      'POST',

      `${environment.API_URL}ServiceRequests/UploadFile`,
      formData, {
      reportProgress: true,
    }
    );
    return this.http.request(req);
  }

  download() {
    return this.http.get(`${environment.API_URL}ServiceRequests/files`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }
}
