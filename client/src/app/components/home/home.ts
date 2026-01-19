import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Footer , Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(private router: Router) {}

  goToLost() {
    this.router.navigate(['/submit']);
  }

  goToFound() {
    this.router.navigate(['/submit']);
  }

  goToSearch() {
    this.router.navigate(['/retrive_item']); 

}

  goToReport() {
    this.router.navigate(['/submit']); 

}

  goTosmart() {
    this.router.navigate(['/retrive_item']); 

}  goToSafely() {
    this.router.navigate(['/retrive_item']); 

}
}
