import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
<div class="login-container">
  <h2>Login</h2>
  <form [formGroup]="loginForm" (ngSubmit)="login()">
    <div>
      <label>Username:</label>
      <input formControlName="username" type="text" />
      <div *ngIf="loginForm.controls['username'].invalid && loginForm.controls['username'].touched" class="error">
        Username is required
      </div>
    </div>

    <div>
      <label>Password:</label>
      <input formControlName="password" type="password" />
      <div *ngIf="loginForm.controls['password'].invalid && loginForm.controls['password'].touched" class="error">
        Password is required
      </div>
    </div>

    <button type="submit" [disabled]="loading">Login</button>

    <div *ngIf="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </form>

  <p style="margin-top: 10px;">
    Don't have an account?
    <a (click)="goToSignup()" style="cursor:pointer; color:blue;">Sign up here</a>
  </p>
</div>
`,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.http.post<any>('https://localhost:7225/api/auth/login', this.loginForm.value)
      .subscribe({
        next: (res) => {
          console.log('Login successful', res);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/gallery']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage = 'Invalid username or password';
          this.loading = false;
        }
      });
  }
}
