import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {

  private apiUrl = `${environment.apiUrl}`; 
  // Exemple : http://localhost:5000/events

  constructor(private http: HttpClient) {}

  // Méthode pour créer un événement
  createEvent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/create`, data);
  }
}
