// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserModel } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  // 🔹 Mock utilisateur pour d'autres pages (comme liste événements)
  private currentUser: UserModel | null = {
    id: '69345cba5d1bcf5c578b4397', // l'_id de ton bénévole
    name: 'Nour',
    role: 'benevole',
    orgId: undefined // pas d'organisation
  };

  constructor(private http: HttpClient) {}

  // ============================================
  // 🔹 INSCRIPTION BÉNÉVOLE (Front → Backend)
  // ============================================
  registerVolunteer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscription/register`, data);
  }

  // ============================================
  // 🔹 INSCRIPTION ORGANISATION (Front → Backend)
  // ============================================
  registerOrganization(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscription/register-org`, data);
  }

  // ============================================================
  // 🔹 Utilisateur courant (mock) — NE CHANGE PAS ton ancien code
  // ============================================================
  getCurrentUser(): Observable<UserModel | null> {
    return of(this.currentUser);
  }

  setCurrentUser(user: UserModel | null) {
    this.currentUser = user;
  }
}
