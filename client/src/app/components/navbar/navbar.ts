import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { removeUser, userStore } from '../../../store/user.store';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly userStore = userStore;
  isMenuOpen = false;
  http = inject(HttpClient);
  router = inject(Router);

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleLogout() {
    this.http.get('http://localhost:3000/api/user/logout', { withCredentials: true }).subscribe({
      next: () => {
        removeUser();
        this.isMenuOpen = false;
        this.router.navigate(['/signin']);
      },
      error: (err: any) => {
        console.error('Logout failed', err);
        // Fallback: clear local state anyway
        removeUser();
        this.isMenuOpen = false;
        this.router.navigate(['/signin']);
      }
    });
  }
}
