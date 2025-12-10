import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventModel } from '../models/event.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${this.apiUrl}/events-list/all`);
  }

  getEventsByUser(userId: string): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${this.apiUrl}/events-list/user/${userId}`);
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/evenements/${eventId}`);
  }


 updateEventStatus(eventId: string, status: 'Ouvert' | 'Fermé' | 'Terminé'): Observable<EventModel> {
  return this.http.put<EventModel>(`${this.apiUrl}/evenements/${eventId}`, { statut: status });
}
}