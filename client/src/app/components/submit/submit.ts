import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Footer } from '../footer/footer';
import { HandHelpingIcon, LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';



@Component({
  selector: 'app-submit',
  templateUrl: './submit.html',
  styleUrls: ['./submit.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgClass,
    HttpClientModule,
    Footer,

  ],
  providers: [
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        HandHelpingIcon
      }),
    },
  ],
})
export class Submit implements OnInit {

  selectedReportType: 'lost' | 'found' = 'lost';

  lostItemForm!: FormGroup;
  foundItemForm!: FormGroup;

  // store images separately (BEST PRACTICE)
  lostPhotos: File[] = [];
  foundPhotos: File[] = [];

  // Preview URLs
  lostPhotoPreviews: string[] = [];
  foundPhotoPreviews: string[] = [];

  // ---------------- UI DATA (unchanged) ----------------
  categories = [
    { value: 'electronics', label: 'Electronics', icon: 'fa-laptop' },
    { value: 'documents', label: 'Documents', icon: 'fa-passport' },
    { value: 'accessories', label: 'Keys & ID', icon: 'fa-key' },
    { value: 'personal', label: 'Personal', icon: 'fa-tshirt' }
  ];
  recentlyFoundItems = [
    { title: 'iPhone 14 Pro Max', time: 'Found 2 hours ago', icon: 'fa-mobile-alt', status: 'found' },
    { title: 'Student Wallet', time: 'Found 1 day ago', icon: 'fa-wallet', status: 'claimed' }
  ];

  recentlyLostItems = [
    { title: 'Ray-Ban Sunglasses', time: 'Lost 3 hours ago', icon: 'fa-glasses', status: 'lost' },
    { title: 'iPad Air 4th Gen', time: 'Lost 1 day ago', icon: 'fa-tablet-alt', status: 'lost' }
  ];

  // -------- UI STATS DATA (FOR TEMPLATE) --------
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  // ---------------- INIT ----------------
  ngOnInit(): void {
    this.initForms();
    this.setInitialDate();
    this.setupCharacterCounters();
  }

  initForms(): void {
    this.lostItemForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      dateLost: ['', Validators.required],
      timeLost: [''],
      location: ['', Validators.required],
      reward: ['no'],
      value: ['']
    });

    this.foundItemForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      dateFound: ['', Validators.required],
      timeFound: [''],
      location: ['', Validators.required],
      condition: [''],
      personalInfo: ['yes'],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  setInitialDate(): void {
    const today = new Date().toISOString().split('T')[0];
    this.lostItemForm.patchValue({ dateLost: today });
    this.foundItemForm.patchValue({ dateFound: today });
  }

  setupCharacterCounters(): void {
    // Lost item description counter
    this.lostItemForm.get('description')?.valueChanges.subscribe(value => {
      const counter = document.getElementById('lostCharCount');
      if (counter) {
        counter.textContent = (value || '').length.toString();
      }
    });

    // Found item description counter
    this.foundItemForm.get('description')?.valueChanges.subscribe(value => {
      const counter = document.getElementById('foundCharCount');
      if (counter) {
        counter.textContent = (value || '').length.toString();
      }
    });
  }

  // ---------------- FORM SWITCH ----------------
  selectReportType(type: 'lost' | 'found'): void {
    this.selectedReportType = type;
  }

  switchToLost(): void {
    this.selectReportType('lost');
  }

  switchToFound(): void {
    this.selectReportType('found');
  }

  // ---------------- FILE HANDLING ----------------
  onFileSelected(event: any, type: 'lost' | 'found'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);

    // Limit total files
    const currentCount = type === 'lost' ? this.lostPhotos.length : this.foundPhotos.length;
    const remainingSlots = 5 - currentCount;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const result = e.target.result;
        if (type === 'lost') {
          this.lostPhotos.push(file);
          this.lostPhotoPreviews.push(result);
        } else {
          this.foundPhotos.push(file);
          this.foundPhotoPreviews.push(result);
        }
        // Force update to ensure preview shows immediately
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    input.value = '';
  }

  removePhoto(type: 'lost' | 'found', index: number): void {
    if (type === 'lost') {
      this.lostPhotos.splice(index, 1);
      this.lostPhotoPreviews.splice(index, 1);
    } else {
      this.foundPhotos.splice(index, 1);
      this.foundPhotoPreviews.splice(index, 1);
    }
    this.cdr.detectChanges();
  }

  triggerFileInput(type: 'lost' | 'found'): void {
    const input = document.getElementById(`${type}FileInput`) as HTMLInputElement;
    input?.click();
  }

  // ---------------- SUBMIT LOST ----------------
  onLostSubmit(): void {
    if (this.lostItemForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();

    Object.entries(this.lostItemForm.value).forEach(([key, value]: any) => {
      formData.append(key, value);
    });

    this.lostPhotos.forEach(file => {
      formData.append('photos', file);
    });

    this.http.post('http://localhost:3000/api/lost', formData, {
      withCredentials: true  // Send cookies with request
    }).subscribe({
      next: () => {
        alert('Lost item saved successfully');
        this.lostItemForm.reset();
        this.lostPhotos = [];
        this.lostPhotoPreviews = []; // Clear previews
        this.setInitialDate();
      },
      error: (err) => {
        console.log(err);
        alert(err.error?.msg || err.error?.message || 'Failed to save lost item');
      }
    });
  }

  // ---------------- SUBMIT FOUND ----------------
  onFoundSubmit(): void {
    if (this.foundItemForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();

    Object.entries(this.foundItemForm.value).forEach(([key, value]: any) => {
      formData.append(key, value);
    });

    this.foundPhotos.forEach(file => {
      formData.append('photos', file);
    });

    this.http.post('http://localhost:3000/api/found', formData, {
      withCredentials: true  // Send cookies with request
    }).subscribe({
      next: () => {
        alert('Found item saved successfully');
        this.foundItemForm.reset();
        this.foundPhotos = [];
        this.foundPhotoPreviews = []; // Clear previews
        this.setInitialDate();
      },
      error: (err) => {
        console.log(err);
        alert(err.error?.msg || err.error?.message || 'Failed to save found item');
      }
    });
  }

  // ---------------- HELPER ----------------
  isFormValid(form: FormGroup): boolean {
    return form.valid;
  }
}
