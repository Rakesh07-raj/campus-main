import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { userStore } from '../../../store/user.store';

@Component({
  selector: 'app-profile',
  imports: [],
  template: `
    <div class="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative">
      <!-- Back Button -->
      <button (click)="goBack()" class="absolute top-20 left-4 md:left-8 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors cursor-pointer">
        <i class="fas fa-arrow-left"></i>
        <span>Back</span>
      </button>

      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Profile Header Card -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative group">
          <div class="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <!-- Decorative Background -->
          <div class="h-40 bg-linear-to-r from-primary via-primary-light to-secondary relative overflow-hidden">
             <div class="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
             <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
             <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div class="px-8 pb-8 relative">
            <div class="flex flex-col md:flex-row items-end md:items-center gap-6 -mt-16">
              <!-- Avatar -->
              <div class="w-32 h-32 rounded-3xl rotate-3 border-4 border-white bg-surface shadow-2xl overflow-hidden flex items-center justify-center shrink-0 group-hover:rotate-0 transition-transform duration-500">
                <span class="text-5xl font-bold text-primary">{{ userStore().name.charAt(0).toUpperCase() }}</span>
              </div>
              
              <!-- Info -->
              <div class="flex-1 pb-2">
                <h1 class="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors">{{ userStore().name }}</h1>
                <div class="flex items-center gap-3 mt-1">
                   <p class="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                     <i class="fas fa-user-shield text-xs"></i>
                     {{ userStore().role || 'Student' }}
                   </p>
                   <span class="text-gray-300">|</span>
                   <p class="text-gray-500 text-sm flex items-center gap-2">
                      <i class="fas fa-envelope text-xs"></i>
                      {{ userStore().email }}
                   </p>
                </div>
              </div>
              
              <div class="mb-4 md:mb-0">
                  <span class="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border border-green-200 flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active
                  </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <!-- Account Stats -->
           <div class="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="fas fa-chart-pie text-primary"></i>
                Activity Overview
              </h3>
              <div class="grid grid-cols-2 gap-4">
                 <div class="bg-surface/50 p-4 rounded-2xl hover:bg-surface transition-colors cursor-pointer">
                    <p class="text-3xl font-bold text-primary mb-1">0</p>
                    <p class="text-xs text-gray-500 uppercase font-semibold">Reported Items</p>
                 </div>
                 <div class="bg-green-50 p-4 rounded-2xl hover:bg-green-100 transition-colors cursor-pointer">
                    <p class="text-3xl font-bold text-green-600 mb-1">0</p>
                    <p class="text-xs text-gray-500 uppercase font-semibold">Claims</p>
                 </div>
              </div>
           </div>

           <!-- User Details -->
           <div class="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
             <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i class="fas fa-id-card text-secondary"></i>
                Identity Details
             </h3>
             <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                   <span class="text-sm text-gray-500">User ID</span>
                   <span class="text-sm font-mono font-medium text-gray-700">{{ userStore().id }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                   <span class="text-sm text-gray-500">Joined Date</span>
                   <span class="text-sm font-medium text-gray-700">Feb 2026</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class Profile {
  readonly userStore = userStore;
  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
