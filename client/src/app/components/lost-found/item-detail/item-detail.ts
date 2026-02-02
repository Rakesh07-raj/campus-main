import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';

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
    selector: 'app-item-detail',
    templateUrl: './item-detail.html',
    styleUrls: ['./item-detail.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, HttpClientModule]
})
export class ItemDetail implements OnInit {
    item: Item | null = null;
    itemId: string = '';
    loading: boolean = true;
    error: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private location: Location
    ) { }

    ngOnInit() {
        // Get item ID from route parameters
        this.route.params.subscribe(params => {
            this.itemId = params['id'];
            if (this.itemId) {
                this.fetchItemDetails();
            }
        });
    }

    fetchItemDetails() {
        this.loading = true;
        this.http.get<any>(`http://localhost:3000/api/items/${this.itemId}`)
            .subscribe({
                next: (data) => {
                    this.item = {
                        id: data._id,
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        location: data.location,
                        dateLost: data.dateLost,
                        dateFound: data.dateFound,
                        createdAt: data.createdAt,
                        status: data.status,
                        images: data.images,
                        contactEmail: data.contactEmail,
                        reward: data.reward,
                        rewardAmount: data.rewardAmount
                    };
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error fetching item details:', err);
                    this.error = 'Failed to load item details';
                    this.loading = false;
                }
            });
    }

    claimItem() {
        if (!confirm(`Are you sure you want to claim: ${this.item?.title}?`)) {
            return;
        }

        this.http.put(`http://localhost:3000/api/items/${this.itemId}/claim`, {})
            .subscribe({
                next: () => {
                    alert('Item claimed successfully!');
                    this.router.navigate(['/lost-found']);
                },
                error: () => {
                    alert('Failed to claim item. Please try again.');
                }
            });
    }

    goBack() {
        this.location.back();
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
            month: 'long',
            day: 'numeric'
        });
    }

    formatTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }

    contactOwner() {
        if (!this.item?.contactEmail) {
            alert('No contact information available for this item.');
            return;
        }

        // Create mailto link with pre-filled subject and body
        const subject = encodeURIComponent(`Regarding: ${this.item.title}`);
        const body = encodeURIComponent(
            `Hi,\n\nI'm interested in the item you ${this.item.status === 'available' ? 'found' : 'lost'}: ${this.item.title}\n\n` +
            `Location: ${this.item.location}\n` +
            `Date: ${this.item.status === 'available' ? this.formatDate(this.item.dateFound) : this.formatDate(this.item.dateLost)}\n\n` +
            `Please let me know if this item is still available.\n\nThank you!`
        );

        // Open default email client
        window.location.href = `mailto:${this.item.contactEmail}?subject=${subject}&body=${body}`;
    }

    reportItem() {
        const reason = prompt(
            'Please explain why you are reporting this item:\n\n' +
            '(e.g., Suspicious content, Spam, False information, etc.)'
        );

        if (!reason || reason.trim() === '') {
            return;
        }

        // In a real application, this would send a report to the backend
        // For now, we'll show a confirmation
        alert(
            'Thank you for your report.\n\n' +
            'Our team will review this item and take appropriate action if necessary.\n\n' +
            'Item ID: ' + this.itemId
        );

        console.log('Item reported:', {
            itemId: this.itemId,
            itemTitle: this.item?.title,
            reason: reason,
            timestamp: new Date().toISOString()
        });
    }

    getStatusColor(status: string): string {
        const colors: { [key: string]: string } = {
            'reported': 'bg-red-100 text-red-700',
            'available': 'bg-green-100 text-green-700',
            'claimed': 'bg-gray-100 text-gray-700',
            'pending': 'bg-yellow-100 text-yellow-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    }
}
