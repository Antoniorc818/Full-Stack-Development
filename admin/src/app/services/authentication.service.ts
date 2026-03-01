import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {}

  public getToken(): string {
    return localStorage.getItem('travlr-token') || '';
  }

  public saveToken(token: string): void {
    localStorage.setItem('travlr-token', token);
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  }

  public getCurrentUser(): any {
    if (this.isLoggedIn()) {
      const token = this.getToken();
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    }
  }

  public login(user: { email: string; password: string }): Promise<any> {
    return this.http.post('/api/login', user).toPromise()
      .then((data: any) => this.saveToken(data.token));
  }

  public register(user: { name: string; email: string; password: string }): Promise<any> {
    return this.http.post('/api/register', user).toPromise()
      .then((data: any) => this.saveToken(data.token));
  }

  public logout(): void {
    localStorage.removeItem('travlr-token');
    this.router.navigateByUrl('/');
  }
}