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
  ArrowLeft,
} from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { addUser } from '../../../store/user.store';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { userStore } from '../../../store/user.store';

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
        ArrowLeft,
      }),
    },
  ],
})
export class SignUp {
  http: HttpClient = inject(HttpClient);
  toast = inject(ToastService);
  constructor(private router: Router) { }

  isPasswordVisible = signal(false);
  isSubmitting = signal(false); // Signal for loading state

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

    this.isSubmitting.set(true);

    const payload = {
      name: this.signUpForm.value.name,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
    };

    this.http
      .post('http://localhost:3000/api/user/signup', payload, {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success(res?.msg || 'Signup Successful');

          // ✅ Store user data from signup response (backend returns { msg, user })
          addUser({
            id: res?.user?._id,
            name: res?.user?.name,
            email: res?.user?.email,
          });

          this.signUpForm.reset();
          this.isSubmitting.set(false);

          // ✅ Redirect to home
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          console.error('Signup error:', err);
          this.toast.failure(err?.error?.msg || 'Signup Failed');
          this.isSubmitting.set(false);
        },
      });
  }

}


console.log(userStore())
