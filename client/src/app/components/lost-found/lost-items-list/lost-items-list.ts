import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Item {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    dateLost?: string;
    createdAt: string;
    status: string;
    images?: string[];
    userId?: string;
}

@Component({
    selector: 'app-lost-items-list',
    templateUrl: './lost-items-list.html',
    styleUrls: ['./lost-items-list.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule]
})
export class LostItemsList implements OnInit {
    allItems: Item[] = [];
    filteredItems: Item[] = [];
    searchQuery: string = '';
    selectedCategory: string = '';
    currentUserId: string = '';

    categories: string[] = [
        'Electronics',
        'Wallets & IDs',
        'Documents',
        'Clothing',
        'Accessories',
        'Keys',
        'Other'
    ];

    constructor(
        private router: Router,
        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getCurrentUser();
        this.fetchAllLostItems();
    }

    getCurrentUser() {
        // Get current user ID from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.currentUserId = user.id || user._id;
            console.log('Current User ID:', this.currentUserId);
        } else {
            console.log('No user found in localStorage');
        }
    }

    fetchAllLostItems() {
        // Fetch lost items from the new /api/lost endpoint
        this.http.get<any[]>('http://localhost:3000/api/lost', {
            withCredentials: true
        }).subscribe({
            next: (data) => {
                console.log('Raw lost items from API:', data);
                console.log('Total items received:', data.length);

                // TEMPORARILY DISABLED FILTERING FOR DEBUGGING - SHOWS ALL ITEMS
                this.allItems = data
                    // .filter(item => {
                    //     const itemUserId = item.userId?._id || item.userId;
                    //     const shouldShow = itemUserId !== this.currentUserId;
                    //     console.log(`Item "${item.title}" - User ID: ${itemUserId}, Current User: ${this.currentUserId}, Show: ${shouldShow}`);
                    //     return shouldShow;
                    // })
                    .map(item => ({
                        id: item._id,
                        title: item.title,
                        description: item.description,
                        category: item.category,
                        location: item.location,
                        dateLost: item.dateLost,
                        createdAt: item.createdAt,
                        status: item.status,
                        images: item.images,
                        userId: item.userId?._id || item.userId
                    }));
                this.filteredItems = this.allItems;
                console.log('Final items to display:', this.filteredItems);

                // Force Angular to update the view
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching lost items:', err)
        });
    }

    applyFilters() {
        let filtered = [...this.allItems];

        // Search filter
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.location.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (this.selectedCategory) {
            filtered = filtered.filter(item => item.category === this.selectedCategory);
        }

        this.filteredItems = filtered;
    }

    resetFilters() {
        this.searchQuery = '';
        this.selectedCategory = '';
        this.filteredItems = this.allItems;
    }

    navigateToDetail(itemId: string) {
        this.router.navigate(['/lost-found/item', itemId]);
    }

    goBack() {
        this.router.navigate(['/lost-found']);
    }

    getCategoryIcon(category: string): string {
        const icons: { [key: string]: string } = {
            'Electronics': 'fas fa-mobile-alt',
            'Documents': 'fas fa-file-alt',
            'Clothing': 'fas fa-tshirt',
            'Accessories': 'fas fa-glasses',
            'Wallets & IDs': 'fas fa-wallet',
            'Keys': 'fas fa-key',
            'Other': 'fas fa-box'
        };
        return icons[category] || 'fas fa-question-circle';
    }

    formatDate(dateString: string | undefined): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }
}
