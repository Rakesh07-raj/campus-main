import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { userStore } from '../../store/user.store';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const user = userStore();

    if (user && user.id) {
        // User is logged in

        // Optional: Check for specific roles if required by the route data
        // const requiredRole = route.data?.['role'];
        // if (requiredRole && user.role !== requiredRole) {
        //   router.navigate(['/']); 
        //   return false;
        // }

        return true;
    } else {
        // User is not logged in
        router.navigate(['/signin']);
        return false;
    }
};
