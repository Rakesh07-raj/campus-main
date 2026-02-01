import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { userStore } from '../../store/user.store';

export const redirectIfAuthGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const user = userStore();

    if (user && user.id) {
        // User is already logged in, redirect based on role
        if (user.role === 'admin') {
            router.navigate(['/dashboard']);
        } else {
            router.navigate(['/']);
        }
        return false;
    }

    return true;
};
