import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class modifProfile {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  updateProfile(userId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/profil/update/${userId}`, formData);
  }

}
