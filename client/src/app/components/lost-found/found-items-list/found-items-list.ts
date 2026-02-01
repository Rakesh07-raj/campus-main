import { Component, OnInit } from '@angular/core';
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
    dateFound?: string;
    createdAt: string;
    status: string;
    images?: string[];
    userId?: string;
}

@Component({
    selector: 'app-found-items-list',
    templateUrl: './found-items-list.html',
    styleUrls: ['./found-items-list.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule]
})
export class FoundItemsList implements OnInit {
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
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.getCurrentUser();
        this.fetchAllFoundItems();
    }

    getCurrentUser() {
        // Get current user ID from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.currentUserId = user.id || user._id;
        }
    }

    fetchAllFoundItems() {
        // Fetch found items from the new /api/found endpoint
        this.http.get<any[]>('http://localhost:3000/api/found')
            .subscribe({
                next: (data) => {
                    this.allItems = data
                        // Filter out items reported by the current user
                        .filter(item => {
                            const itemUserId = item.userId?._id || item.userId;
                            return itemUserId !== this.currentUserId;
                        })
                        .map(item => ({
                            id: item._id,
                            title: item.title,
                            description: item.description,
                            category: item.category,
                            location: item.location,
                            dateFound: item.dateFound,
                            createdAt: item.createdAt,
                            status: item.status,
                            images: item.images,
                            userId: item.userId?._id || item.userId
                        }));
                    this.filteredItems = this.allItems;
                },
                error: (err) => console.error('Error fetching found items:', err)
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
