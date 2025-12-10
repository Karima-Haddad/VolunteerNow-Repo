import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class EventService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {};

    getEventById(id:string):Observable<any>{
        return this.http.get(`${this.apiUrl}/events/${id}`);
    }

    getEventPositions():Observable<any>{
        return this.http.get(`${this.apiUrl}/events/localisations`);
    }

}