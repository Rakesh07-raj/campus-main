import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ArrowRight,
  Eye,
  Key,
  LUCIDE_ICONS,
  LucideAngularModule,
  LucideIconProvider,
  Mail,
  ArrowUpRight,
  LogIn,
  LockKeyhole,
  EyeClosed,
  User,
} from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { addUser } from '../../../store/user.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signUp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './signUp.html',
  styleUrls: ['./signUp.css'],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        Mail,
        Key,
        Eye,
        ArrowRight,
        LogIn,
        ArrowUpRight,
        LockKeyhole,
        EyeClosed,
        User,
      }),
    },
  ],
})
export class SignUp {
  http: HttpClient = inject(HttpClient);
  constructor(private router: Router) {}

  isPasswordVisible = signal(false);
  signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.http
      .post('http://localhost:3000/api/user/signup', this.signUpForm.value, {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res?.msg);

          addUser({
            name: res?.user?.name,
            email: res?.user?.email,
          });

          this.signUpForm.reset();
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          console.log(err?.error?.msg);
        },
      });
  }
}
