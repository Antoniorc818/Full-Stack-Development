import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error = '';

  constructor(private authService: AuthenticationService, private router: Router) {}

  onLoginSubmit(): void {
    this.authService.login(this.credentials)
      .then(() => this.router.navigateByUrl('/trips'))
      .catch(() => this.error = 'Invalid email or password');
  }
}