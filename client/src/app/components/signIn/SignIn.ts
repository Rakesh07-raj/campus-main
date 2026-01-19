import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
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
} from 'lucide-angular';

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
      }),
    },
  ],
})
export class SignIn {
  isPasswordVisible = signal(false);
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

    console.log(this.loginForm.value);
  }
}
