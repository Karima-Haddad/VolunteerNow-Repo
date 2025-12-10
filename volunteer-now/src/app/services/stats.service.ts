import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StatsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {};

    getImpactStats(): Observable<any> {
            return this.http.get(`${this.apiUrl}/stats/impact`);
    }

}
