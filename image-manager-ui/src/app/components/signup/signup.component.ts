import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        alert('Signup successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => alert(err.error || 'Signup failed')
    });
  }
}
