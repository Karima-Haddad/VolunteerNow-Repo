import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


export interface LoginResponse {
  message: string;
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}


@Injectable({
  providedIn: 'root'
})

export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {};

    login(data: {email: string; password: string}){
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`,data)
    }

    forgotPassword(email:string){
        return this.http.post(`${this.apiUrl}/auth/forgot-password`,{ email });
    }

    resetPassword(data: { token: string; password: string }) {
      return this.http.post(`${this.apiUrl}/auth/reset-password/${data.token}`, {
        password: data.password
    });
}


}