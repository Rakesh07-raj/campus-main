import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.html',
  styleUrls: ['./submit.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass ,Navbar, Footer]
})
export class submit implements OnInit {
  selectedReportType: 'lost' | 'found' = 'found';
  lostItemForm: FormGroup;
  foundItemForm: FormGroup;
  
  // Stats data
  lostRecoveryStats = [
    { category: 'Electronics', percentage: 72, color: '#3b82f6' },
    { category: 'Keys & ID Cards', percentage: 85, color: '#10b981' },
    { category: 'Personal Items', percentage: 68, color: '#8b5cf6' }
  ];

  foundReturnStats = [
    { category: 'Wallets & Purses', percentage: 92, color: '#3b82f6' },
    { category: 'Electronics', percentage: 78, color: '#10b981' },
    { category: 'Keys & ID Cards', percentage: 87, color: '#8b5cf6' }
  ];

  recentlyFoundItems = [
    { title: 'iPhone 14 Pro Max', time: 'Found 2 hours ago', icon: 'fa-mobile-alt', status: 'found' },
    { title: 'Student Wallet', time: 'Found 1 day ago', icon: 'fa-wallet', status: 'claimed' }
  ];

  recentlyLostItems = [
    { title: 'Ray-Ban Sunglasses', time: 'Lost 3 hours ago', icon: 'fa-glasses', status: 'lost' },
    { title: 'iPad Air 4th Gen', time: 'Lost 1 day ago', icon: 'fa-tablet-alt', status: 'lost' }
  ];

  categories = [
    { value: 'electronics', label: 'Electronics', icon: 'fa-laptop' },
    { value: 'documents', label: 'Documents', icon: 'fa-passport' },
    { value: 'accessories', label: 'Keys & ID', icon: 'fa-key' },
    { value: 'personal', label: 'Personal', icon: 'fa-tshirt' }
  ];

  constructor(private fb: FormBuilder) {
    this.lostItemForm = this.fb.group({
      title: ['', Validators.required],
      category: ['electronics', Validators.required],
      description: ['', Validators.required],
      dateLost: ['', Validators.required],
      timeLost: [''],
      location: ['', Validators.required],
      reward: ['no'],
      value: [''],
      photos: [[]]
    });

    this.foundItemForm = this.fb.group({
      title: ['', Validators.required],
      category: ['documents', Validators.required],
      description: ['', Validators.required],
      dateFound: ['', Validators.required],
      timeFound: [''],
      location: ['', Validators.required],
      condition: [''],
      personalInfo: ['yes'],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photos: [[]]
    });
  }

  ngOnInit(): void {
    this.setInitialDate();
  }

  setInitialDate(): void {
    const today = new Date().toISOString().split('T')[0];
    this.lostItemForm.patchValue({ dateLost: today });
    this.foundItemForm.patchValue({ dateFound: today });
  }

  selectReportType(type: 'lost' | 'found'): void {
    this.selectedReportType = type;
  }

  switchToLost(): void {
    this.selectReportType('lost');
  }

  switchToFound(): void {
    this.selectReportType('found');
  }

  onLostSubmit(): void {
    if (this.lostItemForm.valid) {
      console.log('Lost Item Form Submitted:', this.lostItemForm.value);
      alert('Lost item report submitted successfully! We\'ll notify you if someone finds it.');
      setTimeout(() => {
        this.lostItemForm.reset();
        this.setInitialDate();
      }, 2000);
    } else {
      alert('Please fill all required fields marked with *');
    }
  }

  onFoundSubmit(): void {
    if (this.foundItemForm.valid) {
      console.log('Found Item Form Submitted:', this.foundItemForm.value);
      alert('Found item report submitted! Thank you for helping return it to its owner.');
      setTimeout(() => {
        this.foundItemForm.reset();
        this.setInitialDate();
      }, 2000);
    } else {
      alert('Please fill all required fields marked with *');
    }
  }

  onFileSelected(event: any, formType: 'lost' | 'found'): void {
    const files = event.target.files;
    if (files.length > 0) {
      const fileArray = Array.from(files).slice(0, 5);
      if (formType === 'lost') {
        this.lostItemForm.patchValue({ photos: fileArray });
      } else {
        this.foundItemForm.patchValue({ photos: fileArray });
      }
      alert(`${fileArray.length} photo(s) uploaded successfully`);
    }
  }

  triggerFileInput(formType: 'lost' | 'found'): void {
    const fileInput = document.getElementById(`${formType}FileInput`) as HTMLInputElement;
    fileInput?.click();
  }

  // Helper method to check form validity
  isFormValid(form: FormGroup): boolean {
    return form.valid;
  }
}