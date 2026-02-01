import { Component } from '@angular/core';
import { Footer } from '../footer/footer';

import { Router } from '@angular/router';
import { userStore } from "../../../store/user.store"

@Component({
  selector: 'app-home',
  imports: [Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(private router: Router) { }

  goToLost() {
    this.router.navigate(['/submit']);
  }

  getUser() {
    console.log(userStore())
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

  } goToSafely() {
    this.router.navigate(['/retrive_item']);

  }
}
