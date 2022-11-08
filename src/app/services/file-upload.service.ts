import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  stop_Number = 1;
  document_Type = 4;

  private baseUrl = 'https://localhost:7014/api/ServiceRequests';

  constructor(private http: HttpClient) { }

  upload(file: File, el:any): Observable<HttpEvent<any>> {
    const {serviceRequest_Id, document_Id, stop_Number, userId, fileType} = el;
    const formData: FormData = new FormData();

    formData.append('documentFile', file);
    formData.append('ServiceRequest_Id', serviceRequest_Id.toString());
    formData.append('Document_Id', document_Id.toString());
    formData.append('Stop_Number', stop_Number.toString());
    formData.append('Document_Type', fileType.toString());
    formData.append('User_Logged', userId.toString());

    const req = new HttpRequest(
      'POST',
      `https://localhost:7014/api/ServiceRequests/UploadFile`,
      formData, {
      reportProgress: true,
    }
    );
    return this.http.request(req);
  }

  download() {
    return this.http.get(`${this.baseUrl}/files`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }
}
