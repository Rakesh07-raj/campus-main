import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Item {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    dateLost?: string;
    dateFound?: string;
    createdAt: string;
    status: 'reported' | 'available' | 'claimed' | 'pending';
    images?: string[];
    userId?: string;
}

@Component({
    selector: 'app-my-activity',
    templateUrl: './my-activity.html',
    styleUrls: ['./my-activity.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, HttpClientModule]
})
export class MyActivity implements OnInit {
    activeTab: 'lost' | 'found' = 'lost';
    myLostItems: Item[] = [];
    myFoundItems: Item[] = [];
    loading: boolean = true;
    currentUserId: string = '';

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.getCurrentUser();
    }

    getCurrentUser() {
        // Get current user from localStorage or auth service
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.currentUserId = user.id || user._id;
            this.fetchMyItems();
        } else {
            this.loading = false;
        }
    }

    fetchMyItems() {
        this.loading = true;

        // Fetch all items and filter by current user
        this.http.get<any[]>('http://localhost:3000/api/items')
            .subscribe({
                next: (data) => {
                    // Filter lost items by current user
                    this.myLostItems = data
                        .filter(item => item.status === 'reported' && this.isMyItem(item))
                        .map(item => this.mapItem(item));

                    // Filter found items by current user
                    this.myFoundItems = data
                        .filter(item => item.status === 'available' && this.isMyItem(item))
                        .map(item => this.mapItem(item));

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error fetching items:', err);
                    this.loading = false;
                }
            });
    }

    isMyItem(item: any): boolean {
        // Check if item belongs to current user
        // Adjust this based on your API structure
        return item.userId === this.currentUserId ||
            item.user === this.currentUserId ||
            item.createdBy === this.currentUserId;
    }

    mapItem(item: any): Item {
        return {
            id: item._id,
            title: item.title,
            description: item.description,
            category: item.category,
            location: item.location,
            dateLost: item.dateLost,
            dateFound: item.dateFound,
            createdAt: item.createdAt,
            status: item.status,
            images: item.images,
            userId: item.userId || item.user || item.createdBy
        };
    }

    switchTab(tab: 'lost' | 'found') {
        this.activeTab = tab;
    }

    navigateToDetail(itemId: string) {
        this.router.navigate(['/lost-found/item', itemId]);
    }

    deleteItem(itemId: string, event: Event) {
        event.stopPropagation();

        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        this.http.delete(`http://localhost:3000/api/items/${itemId}`)
            .subscribe({
                next: () => {
                    // Refresh the list
                    this.fetchMyItems();
                    alert('Item deleted successfully');
                },
                error: () => {
                    alert('Failed to delete item');
                }
            });
    }

    editItem(itemId: string, event: Event) {
        event.stopPropagation();
        // Navigate to edit page (you can implement this later)
        this.router.navigate(['/submit'], { queryParams: { edit: itemId } });
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

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'reported': 'Lost',
            'available': 'Found',
            'claimed': 'Claimed',
            'pending': 'Pending'
        };
        return labels[status] || status;
    }

    getStatusColor(status: string): string {
        const colors: { [key: string]: string } = {
            'reported': 'bg-red-100 text-red-700 border-red-200',
            'available': 'bg-green-100 text-green-700 border-green-200',
            'claimed': 'bg-gray-100 text-gray-700 border-gray-200',
            'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    }
}
