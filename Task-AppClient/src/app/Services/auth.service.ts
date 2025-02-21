import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../Models/UserDto';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';  
import { TOKEN_KEY } from '../Environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // Method to sign up a new user
  signup(formData: UserDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }

  // Method to sign in a user and store the token
  signin(formData: UserDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, formData).pipe(
      tap(res => {
        if (res && res.accessToken) {
          localStorage.setItem(TOKEN_KEY, res.accessToken);  
        } else {
          console.error('No accessToken in the response');
        }
      }),
      catchError(err => {
        console.error('Login error:', err);
        throw err;  // Rethrow the error to be handled by the component
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY); 
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  logout(): void {
    // Remove both tokens
    localStorage.removeItem(TOKEN_KEY);  // Removes 'token'
    localStorage.removeItem('access_token');  // Removes 'access_token'
  }
}
