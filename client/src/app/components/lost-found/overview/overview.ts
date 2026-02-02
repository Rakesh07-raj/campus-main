import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    contactEmail?: string;
    reward?: boolean;
    rewardAmount?: number;
}

@Component({
    selector: 'app-overview',
    templateUrl: './overview.html',
    styleUrls: ['./overview.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, HttpClientModule]
})
export class Overview implements OnInit {
    recentLostItems: Item[] = [];
    recentFoundItems: Item[] = [];
    lostItemsCount: number = 0;
    foundItemsCount: number = 0;

    constructor(
        private router: Router,
        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.fetchRecentLostItems();
        this.fetchRecentFoundItems();
    }

    fetchRecentLostItems() {
        this.http.get<any[]>('http://localhost:3000/api/lost', {
            withCredentials: true
        }).subscribe({
            next: (data) => {
                console.log('Overview - Lost items received:', data);
                this.lostItemsCount = data.length;
                this.recentLostItems = data.slice(0, 6).map(item => ({
                    id: item._id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    location: item.location,
                    dateLost: item.dateLost,
                    createdAt: item.createdAt,
                    status: item.status,
                    images: item.images
                }));
                console.log('Overview - Recent lost items:', this.recentLostItems);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching lost items:', err)
        });
    }

    fetchRecentFoundItems() {
        this.http.get<any[]>('http://localhost:3000/api/found', {
            withCredentials: true
        }).subscribe({
            next: (data) => {
                console.log('Overview - Found items received:', data);
                this.foundItemsCount = data.length;
                this.recentFoundItems = data.slice(0, 6).map(item => ({
                    id: item._id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    location: item.location,
                    dateFound: item.dateFound,
                    createdAt: item.createdAt,
                    status: item.status,
                    images: item.images
                }));
                console.log('Overview - Recent found items:', this.recentFoundItems);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching found items:', err)
        });
    }

    navigateToLostItems() {
        this.router.navigate(['/lost-found/lost']);
    }

    navigateToFoundItems() {
        this.router.navigate(['/lost-found/found']);
    }

    navigateToDetail(itemId: string) {
        this.router.navigate(['/lost-found/item', itemId]);
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
