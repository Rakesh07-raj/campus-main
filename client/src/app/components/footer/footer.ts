import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {


    constructor(private router: Router) {}
  
    find() {
      this.router.navigate(['/submit']);
    }

    
    report() {
      this.router.navigate(['/submit']);
    }
    
    recent() {
      this.router.navigate(['/retrieve_item']);
    }
    
    success() {
      this.router.navigate(['/about']);
    }
  

}
