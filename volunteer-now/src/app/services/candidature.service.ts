import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CandidatureService{

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {};

    getCandidatureStatus(eventId: string): Observable<any> {
      const token = localStorage.getItem('token');

      const headers = {
        Authorization: `Bearer ${token}`
      };

      return this.http.get(`${this.apiUrl}/candidature/status/${eventId}`, {
        headers
      });
    }

    participer(eventId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidature/evenements/${eventId}/participer`, {});
  }

  updateStatus(candidatureId: string, statut: "acceptee" | "refusee") {
    return this.http.patch(
      `${environment.apiUrl}/candidature/candidatures/${candidatureId}/status`,
      { statut }
    );
  }
}


