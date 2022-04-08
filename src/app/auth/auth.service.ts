import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthData {
  accessToken: string;
  user: {
    email: string;
    id: number;
    name: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwthelper = new JwtHelperService();
  private authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();
  timeoutRef: any;
  constructor(private http: HttpClient, private router: Router) {
    this.restore()
  }
  login(data: { email: string; password: string }) {
    return this.http
      .post<AuthData>(`${environment.apiBaseUrl}/login`, data)
      .pipe(
        tap((data) => {
          console.log('user auth data:', data);
        }),
        tap((data) => {
          this.authSub.next(data);
          localStorage.setItem('user', JSON.stringify(data));
          this.autoLogOut(data);
        }),
        catchError(this.errors)
      );
  }
  register(data: { email: string; password: string; name: string }) {
    return this.http
      .post(`${environment.apiBaseUrl}/register`, data)
      .pipe(catchError(this.errors));
  }

  restore() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return;
    }
    const user: AuthData = JSON.parse(userJson);
    if (this.jwthelper.isTokenExpired(user.accessToken)) {
      return;
    }

    this.authSub.next(user);
    this.autoLogOut(user);
  }
  logout() {
    this.authSub.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }
  }

  autoLogOut(user: AuthData) {
    const dateEx = this.jwthelper.getTokenExpirationDate(
      user.accessToken
    ) as Date;
    const msEx = dateEx.getTime() - new Date().getTime();
    this.timeoutRef = setTimeout(() => {
      this.logout();
    }, msEx);
  }

  private errors(err: any) {
    switch (err.error) {
      case 'Email already exists':
        return throwError('Utente gia presente');

        break;

      default:
        return throwError('Errore nella chimata riprovare');

        break;
    }
  }
}
