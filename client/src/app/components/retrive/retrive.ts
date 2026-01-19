import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  time: string;
  status: 'available' | 'pending' | 'claimed';
  image?: string;
  icon: string;
  badge?: 'new' | 'featured' | 'urgent';
}

interface LostItem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  dateLost: string;
  photo?: string;
  contactEmail: string;
  reward: boolean;
  rewardAmount?: number;
  status: 'active' | 'resolved';
}

interface FilterCategory {
  name: string;
  count: number;
  active: boolean;
}

interface LocationFilter {
  name: string;
  count: number;
  active: boolean;
}

interface TimeFilter {
  label: string;
  value: string;
  active: boolean;
}

interface StatusFilter {
  label: string;
  value: 'available' | 'pending' | 'claimed';
  active: boolean;
  count: number;
}

@Component({
  selector: 'app-retrive',
  templateUrl: './retrive.html',
  styleUrls: ['./retrive.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule ,Navbar, Footer]
})
export class Retrive implements OnInit {
  // Search properties
  searchQuery: string = '';
  searchTab: string = 'search';
  
  // View properties
  activeView: 'grid' | 'list' = 'grid';
  sortBy: string = 'newest';
  
  // Modal states
  showReportModal: boolean = false;
  showLostItemsModal: boolean = false;
  
  // Report form
  reportForm = {
    title: '',
    category: '',
    description: '',
    location: '',
    dateLost: '',
    contactEmail: '',
    reward: false,
    rewardAmount: 0,
    photo: null as File | null
  };

  // Filter properties
  categories: FilterCategory[] = [
    { name: 'Electronics', count: 428, active: false },
    { name: 'Wallets & IDs', count: 312, active: false },
    { name: 'Books', count: 156, active: false },
    { name: 'Clothing', count: 89, active: false },
    { name: 'Accessories', count: 67, active: false },
    { name: 'Documents', count: 54, active: false },
    { name: 'Other', count: 743, active: false }
  ];

  locations: LocationFilter[] = [
    { name: 'Main Library', count: 215, active: false },
    { name: 'Student Center', count: 183, active: false },
    { name: 'Cafeteria', count: 142, active: false },
    { name: 'Sports Complex', count: 98, active: false },
    { name: 'Academic Building', count: 76, active: false },
    { name: 'Parking Lot', count: 64, active: false },
    { name: 'Other Areas', count: 456, active: false }
  ];

  timeFilters: TimeFilter[] = [
    { label: 'Last 24 hours', value: '24h', active: true },
    { label: 'Last week', value: 'week', active: false },
    { label: 'Last month', value: 'month', active: false },
    { label: 'All time', value: 'all', active: false }
  ];

  statusFilters: StatusFilter[] = [
    { label: 'Available', value: 'available', active: true, count: 856 },
    { label: 'Pending', value: 'pending', active: false, count: 43 },
    { label: 'Claimed', value: 'claimed', active: false, count: 124 }
  ];

  // Sample found items data
  allItems: Item[] = [
    {
      id: 1,
      title: 'iPhone 14 Pro Max',
      description: 'Space gray, found near library entrance. Has a black case with star pattern.',
      category: 'Electronics',
      location: 'Main Library',
      time: 'Found 2 hours ago',
      status: 'available',
      icon: 'fas fa-mobile-alt',
      badge: 'new'
    },
    {
      id: 2,
      title: 'Student ID Card',
      description: 'University student ID, name: Sarah Johnson. Found in cafeteria.',
      category: 'Wallets & IDs',
      location: 'Cafeteria',
      time: 'Found 1 day ago',
      status: 'pending',
      icon: 'fas fa-id-card',
      badge: 'urgent'
    },
    {
      id: 3,
      title: 'MacBook Pro 16"',
      description: 'Silver, 2023 model. Found in study room B, library 2nd floor.',
      category: 'Electronics',
      location: 'Main Library',
      time: 'Found 3 days ago',
      status: 'available',
      icon: 'fas fa-laptop'
    },
    {
      id: 4,
      title: 'Nike Air Max Shoes',
      description: 'White/blue color, size 10. Found in sports complex locker room.',
      category: 'Clothing',
      location: 'Sports Complex',
      time: 'Found 1 week ago',
      status: 'available',
      icon: 'fas fa-tshirt'
    },
    {
      id: 5,
      title: 'Textbook: Calculus 4th Ed',
      description: 'Blue cover, includes handwritten notes. Found in academic building.',
      category: 'Books',
      location: 'Academic Building',
      time: 'Found 2 days ago',
      status: 'available',
      icon: 'fas fa-book',
      badge: 'featured'
    },
    {
      id: 6,
      title: 'Ray-Ban Sunglasses',
      description: 'Black aviator style, in brown case. Found in student center.',
      category: 'Accessories',
      location: 'Student Center',
      time: 'Found 5 hours ago',
      status: 'claimed',
      icon: 'fas fa-glasses'
    },
    {
      id: 7,
      title: 'Passport & Travel Wallet',
      description: 'Brown leather wallet containing passport and boarding passes.',
      category: 'Wallets & IDs',
      location: 'Student Center',
      time: 'Found 1 day ago',
      status: 'available',
      icon: 'fas fa-passport',
      badge: 'urgent'
    },
    {
      id: 8,
      title: 'Apple Watch Series 8',
      description: 'Midnight aluminum case, sport band. Found near gym.',
      category: 'Electronics',
      location: 'Sports Complex',
      time: 'Found 4 hours ago',
      status: 'available',
      icon: 'fas fa-clock',
      badge: 'new'
    },
    {
      id: 9,
      title: 'AirPods Pro 2nd Gen',
      description: 'White, in charging case. Found in lecture hall A.',
      category: 'Electronics',
      location: 'Academic Building',
      time: 'Found 1 day ago',
      status: 'available',
      icon: 'fas fa-headphones'
    },
    {
      id: 10,
      title: 'Leather Backpack',
      description: 'Brown leather, contains notebooks and pens.',
      category: 'Accessories',
      location: 'Student Center',
      time: 'Found 3 days ago',
      status: 'available',
      icon: 'fas fa-briefcase'
    }
  ];

  // Sample lost items data
  lostItems: LostItem[] = [
    {
      id: 1,
      title: 'Gold Wedding Ring',
      description: '18k gold wedding band with inscription "Forever Yours". Lost near fountain.',
      category: 'Jewelry',
      location: 'Main Quad',
      dateLost: '2024-01-15',
      contactEmail: 'john.doe@email.com',
      reward: true,
      rewardAmount: 500,
      status: 'active'
    },
    {
      id: 2,
      title: 'University Lab Coat',
      description: 'White lab coat with name tag "Dr. Smith". Size medium.',
      category: 'Clothing',
      location: 'Science Building',
      dateLost: '2024-01-10',
      contactEmail: 'alice.smith@email.com',
      reward: false,
      status: 'active'
    },
    {
      id: 3,
      title: 'Calculus Textbook',
      description: 'Blue hardcover, 4th edition. Has notes on pages 45-78.',
      category: 'Books',
      location: 'Library Study Room',
      dateLost: '2024-01-05',
      contactEmail: 'bob.johnson@email.com',
      reward: true,
      rewardAmount: 50,
      status: 'resolved'
    }
  ];

  // Filtered items
  filteredItems: Item[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  displayedItems: Item[] = [];
  pageNumbers: (number | string)[] = [];

  // Photo preview
  photoPreview: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
    this.updatePageNumbers();
  }

  // Modal controls
  openReportModal(): void {
    this.showReportModal = true;
    // Set default date to today
    this.reportForm.dateLost = new Date().toISOString().split('T')[0];
  }

  closeReportModal(): void {
    this.showReportModal = false;
    this.resetReportForm();
  }

  openLostItemsModal(): void {
    this.showLostItemsModal = true;
  }

  closeLostItemsModal(): void {
    this.showLostItemsModal = false;
  }

  // Report form
  resetReportForm(): void {
    this.reportForm = {
      title: '',
      category: '',
      description: '',
      location: '',
      dateLost: '',
      contactEmail: '',
      reward: false,
      rewardAmount: 0,
      photo: null
    };
    this.photoPreview = null;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.reportForm.photo = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitReport(): void {
    // Validate form
    if (!this.reportForm.title || !this.reportForm.category || !this.reportForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new lost item
    const newLostItem: LostItem = {
      id: this.lostItems.length + 1,
      title: this.reportForm.title,
      description: this.reportForm.description,
      category: this.reportForm.category,
      location: this.reportForm.location,
      dateLost: this.reportForm.dateLost,
      contactEmail: this.reportForm.contactEmail,
      reward: this.reportForm.reward,
      rewardAmount: this.reportForm.rewardAmount,
      status: 'active'
    };

    // Add to lost items list
    this.lostItems.unshift(newLostItem);

    // Show success message
    alert('Your missing item report has been submitted successfully!');

    // Close modal and reset form
    this.closeReportModal();

    // Open lost items modal to show the new item
    setTimeout(() => {
      this.openLostItemsModal();
    }, 500);
  }

  // Search functionality
  setSearchTab(tab: string): void {
    this.searchTab = tab;
    if (tab === 'report') {
      this.openReportModal();
    }
  }

  performSearch(): void {
    this.applyFilters();
  }

  // Filter functionality
  filterByRecent(): void {
    this.timeFilters.forEach(filter => filter.active = filter.value === '24h');
    this.applyFilters();
  }

  filterByCategory(category: string): void {
    const categoryObj = this.categories.find(c => 
      c.name.toLowerCase().includes(category.toLowerCase()) || 
      category.toLowerCase().includes(c.name.toLowerCase())
    );
    
    if (categoryObj) {
      this.categories.forEach(c => c.active = false);
      categoryObj.active = true;
      this.applyFilters();
    }
  }

  toggleCategory(categoryName: string): void {
    const category = this.categories.find(c => c.name === categoryName);
    if (category) {
      category.active = !category.active;
      this.applyFilters();
    }
  }

  toggleLocation(locationName: string): void {
    const location = this.locations.find(l => l.name === locationName);
    if (location) {
      location.active = !location.active;
      this.applyFilters();
    }
  }

  setTimeFilter(timeValue: string): void {
    this.timeFilters.forEach(filter => {
      filter.active = filter.value === timeValue;
    });
    this.applyFilters();
  }

  toggleStatus(statusValue: 'available' | 'pending' | 'claimed'): void {
    const status = this.statusFilters.find(s => s.value === statusValue);
    if (status) {
      status.active = !status.active;
      this.applyFilters();
    }
  }

  resetFilters(): void {
    // Reset all filters
    this.categories.forEach(c => c.active = false);
    this.locations.forEach(l => l.active = false);
    this.timeFilters.forEach(t => t.active = t.value === '24h');
    this.statusFilters.forEach(s => s.active = s.value === 'available');
    this.searchQuery = '';
    this.sortBy = 'newest';
    
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allItems];
    
    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filters
    const activeCategories = this.categories.filter(c => c.active).map(c => c.name);
    if (activeCategories.length > 0) {
      filtered = filtered.filter(item => activeCategories.includes(item.category));
    }
    
    // Apply location filters
    const activeLocations = this.locations.filter(l => l.active).map(l => l.name);
    if (activeLocations.length > 0) {
      filtered = filtered.filter(item => activeLocations.includes(item.location));
    }
    
    // Apply status filters
    const activeStatuses = this.statusFilters.filter(s => s.active).map(s => s.value);
    if (activeStatuses.length > 0) {
      filtered = filtered.filter(item => activeStatuses.includes(item.status));
    }
    
    // Apply time filter (simplified logic)
    const activeTimeFilter = this.timeFilters.find(t => t.active);
    if (activeTimeFilter) {
      // This is a simplified time filter - in real app you'd use actual dates
      if (activeTimeFilter.value === '24h') {
        filtered = filtered.filter(item => item.time.includes('hours') || item.time.includes('1 day'));
      } else if (activeTimeFilter.value === 'week') {
        filtered = filtered.filter(item => 
          item.time.includes('days') || 
          item.time.includes('week') || 
          item.time.includes('hours')
        );
      }
    }
    
    // Apply sorting
    filtered = this.applySorting(filtered);
    
    this.filteredItems = filtered;
    this.updatePagination();
    this.updateDisplayedItems();
  }

  applySorting(items: Item[]): Item[] {
    const sorted = [...items];
    
    switch (this.sortBy) {
      case 'newest':
        // Sort by time (newest first) - simplified
        return sorted.sort((a, b) => {
          const aTime = this.extractTimeValue(a.time);
          const bTime = this.extractTimeValue(b.time);
          return aTime - bTime;
        });
        
      case 'relevant':
        // Sort by relevance (has badge, then search match)
        return sorted.sort((a, b) => {
          const aScore = this.calculateRelevanceScore(a);
          const bScore = this.calculateRelevanceScore(b);
          return bScore - aScore;
        });
        
      case 'location':
        // Sort by location
        return sorted.sort((a, b) => a.location.localeCompare(b.location));
        
      default:
        return sorted;
    }
  }

  applySort(): void {
    this.applyFilters();
  }

  // View controls
  setView(view: 'grid' | 'list'): void {
    this.activeView = view;
  }

  // Item actions
  viewItemDetails(item: Item): void {
    // Navigate to item details page or show modal
    console.log('Viewing item:', item);
    alert(`Viewing details for: ${item.title}\n\nDescription: ${item.description}\nLocation: ${item.location}\nStatus: ${item.status}`);
  }

  claimItem(item: Item): void {
    if (item.status === 'available') {
      item.status = 'pending';
      alert(`Claim request sent for: ${item.title}. Please wait for confirmation.`);
      this.applyFilters(); // Refresh filtered items
    }
  }

  // Smart matching
  runSmartMatch(): void {
    // Implement smart matching logic
    alert('Running smart matching... Scanning for your lost items. You will be notified if matches are found.');
  }

  // Stats actions
  showItemsByCategory(category: string): void {
    this.filterByCategory(category);
    // Scroll to items grid
    setTimeout(() => {
      const itemsGrid = document.querySelector('.items-grid');
      itemsGrid?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  showSuccessStories(): void {
    alert('Showing success stories and testimonials...');
  }

  showTestimonials(): void {
    alert('Showing testimonials from happy users...');
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePageNumbers();
  }

  updateDisplayedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  updatePageNumbers(): void {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (this.currentPage > 3) {
        pages.push('...');
      }
      
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(this.totalPages);
    }
    
    this.pageNumbers = pages;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedItems();
      this.updatePageNumbers();
      // Scroll to top of items grid
      setTimeout(() => {
        const itemsGrid = document.querySelector('.items-grid');
        itemsGrid?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Helper methods
  getActiveFiltersCount(): number {
    let count = 0;
    count += this.categories.filter(c => c.active).length;
    count += this.locations.filter(l => l.active).length;
    count += this.statusFilters.filter(s => s.active && s.value !== 'available').length;
    count += this.timeFilters.filter(t => t.active && t.value !== '24h').length;
    return count;
  }

  private extractTimeValue(timeString: string): number {
    if (timeString.includes('hours')) {
      return parseInt(timeString.match(/\d+/)?.[0] || '0');
    } else if (timeString.includes('day')) {
      return parseInt(timeString.match(/\d+/)?.[0] || '1') * 24;
    } else if (timeString.includes('week')) {
      return parseInt(timeString.match(/\d+/)?.[0] || '1') * 168;
    } else if (timeString.includes('days')) {
      return parseInt(timeString.match(/\d+/)?.[0] || '1') * 24;
    }
    return 999; // For older items
  }

  private calculateRelevanceScore(item: Item): number {
    let score = 0;
    
    // Items with badges are more relevant
    if (item.badge === 'urgent') score += 30;
    if (item.badge === 'new') score += 20;
    if (item.badge === 'featured') score += 15;
    
    // Items available are more relevant
    if (item.status === 'available') score += 25;
    
    // Recent items are more relevant
    if (item.time.includes('hours')) score += 40;
    if (item.time.includes('day')) score += 30;
    if (item.time.includes('days')) score += 15;
    
    // Search relevance
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      if (item.title.toLowerCase().includes(query)) score += 50;
      if (item.description.toLowerCase().includes(query)) score += 30;
      if (item.category.toLowerCase().includes(query)) score += 25;
      if (item.location.toLowerCase().includes(query)) score += 20;
    }
    
    return score;
  }

  getCategoryIcon(category: string): string {
    switch(category.toLowerCase()) {
      case 'electronics': return 'fas fa-laptop';
      case 'wallets & ids': return 'fas fa-wallet';
      case 'books': return 'fas fa-book';
      case 'clothing': return 'fas fa-tshirt';
      case 'accessories': return 'fas fa-glasses';
      case 'documents': return 'fas fa-file-alt';
      case 'jewelry': return 'fas fa-gem';
      default: return 'fas fa-question-circle';
    }
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}