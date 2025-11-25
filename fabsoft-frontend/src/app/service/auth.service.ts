import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ADMIN_KEY = 'isAdminAuthenticated';
  private readonly correctPassword: string = 'admin123';

  constructor() { }

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.ADMIN_KEY) === 'true';
  }

  authenticate(password: string): boolean {
    if (password === this.correctPassword) {
      sessionStorage.setItem(this.ADMIN_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(this.ADMIN_KEY);
  }

  promptForPassword(): boolean {
    if (this.isAuthenticated()) {
      return true;
    }

    const password = prompt('Please enter the admin password:');
    if (password && this.authenticate(password)) {
      return true;
    } else {
      alert('Incorrect password!');
      return false;
    }
  }
}
