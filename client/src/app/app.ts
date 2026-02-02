import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HttpClient } from '@angular/common/http';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { addUser } from '../store/user.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, NgxSonnerToaster],
  templateUrl: `app.html`,
  styleUrl: './app.css',
})


export class App implements OnInit {
  protected readonly title = signal('client');
  http = inject(HttpClient);
  isLoading = signal(true);
  router = inject(Router);

  // Reactive signal for auth page state
  isAuthPage = signal(false);

  constructor() {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      this.isAuthPage.set(currentUrl.includes('/signin') || currentUrl.includes('/signup'));
    });
  }

  ngOnInit(): void {
    // Initial check
    const currentUrl = this.router.url;
    this.isAuthPage.set(currentUrl.includes('/signin') || currentUrl.includes('/signup'));

    this.http
      .get('http://localhost:3000/api/user/me', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res)
          addUser({
            id: res.user._id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
          });
          setTimeout(() => {
            this.isLoading.set(false);
          }, 1000);
        },
        error: (err) => {
          console.log('User not logged in or session expired');
          setTimeout(() => {
            this.isLoading.set(false);
          }, 3000);
        },
      });
  }
}
