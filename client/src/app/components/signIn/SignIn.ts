import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ArrowRight,
  Box,
  CheckCircle,
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
  ArrowLeft,
} from 'lucide-angular';
import { ToastService } from '../../services/toast.service';
import { addUser } from '../../../store/user.store';

@Component({
  selector: 'app-signIn',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './SignIn.html',
  styleUrls: ['./SignIn.css'],
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
        ArrowLeft,
      }),
    },
  ],
})
export class SignIn {
  http = inject(HttpClient);
  router = inject(Router);
  toast = inject(ToastService);

  isPasswordVisible = signal(false);
  isSubmitting = signal(false);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.http
      .post('http://localhost:3000/api/user/signin', this.loginForm.value, {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success(res?.msg || 'Login Successful');
          console.log(res);
          addUser({
            id: res?.user?._id,
            name: res?.user?.name,
            email: res?.user?.email,
            role: res?.user?.role,
          });
          this.loginForm.reset();
          this.isSubmitting.set(false);
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          console.log(err)
          this.toast.failure(err?.error?.msg || 'Login Failed');
          this.isSubmitting.set(false);
        },
      });
  }
}
