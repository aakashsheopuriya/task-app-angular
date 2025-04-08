import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(public router: Router) {
    this.router.events.subscribe(() => {
      this.showHeaderFooter = !['/login', '/signup'].includes(this.router.url);
    });
  }
  showHeaderFooter: boolean = true;
  title = 'Task App';
  email = localStorage.getItem('email');
}
