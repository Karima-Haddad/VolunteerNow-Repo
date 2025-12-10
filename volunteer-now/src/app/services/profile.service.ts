import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MyProfileResponse {
  user: {
    _id: string;
    name: string;
    role: 'benevole' | 'organisation';
    bio?: string;
    photo?: string;
    categories?: string;       // ex: "Écologie & Environnement,Santé & Bien-être"
    
    ville?: string;
    phone?: string;
    organisation_infos?: {
      description?: string;
      contact?: string;
    };

  };
  stats: {
    totalBadges?: number;
    totalCandidatures?: number;
    totalEvents?: number;      // pour organisation
  };
  badges?: {
    badge_id: {
      niveau: string;         // "Bronze" / "Argent"...
      icon?: string;          // "🥉" etc.
    };
  }[];
  lastCandidatures?: {
    statut: string;
    event_id: {
      titre: string;
      date_event: string;
      localisation: string;
      statut?: string;
    };
  }[];
  lastEvents?: {
    _id: string;
    titre: string;
    date_event: string;
    localisation: string;
    statut?: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<MyProfileResponse> {
    return this.http.get<MyProfileResponse>(`${this.apiUrl}/profil/me`);
  }

  getUserProfile(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/profil/${id}`);
    }

}
