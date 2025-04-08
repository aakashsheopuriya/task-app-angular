import { Component } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgbNavModule,
    NgbDropdownModule,
    NgIf,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    public router: Router,
    public service: ApiService,
    public activatedRoute: ActivatedRoute,
    public userservice: UserService
  ) {
    this.router.events.subscribe(() => {
      if (this.router.url == '/task') {
        this.active = 2;
      } else if (this.router.url == '/dashboard') {
        this.active = 1;
      } else {
        this.active = 3;
      }
    });
  }

  active: number = 1;
  userData: any;
  profileImage: any;

  ngOnInit() {
    this.userservice.profileImage$.subscribe((image) => {
      this.profileImage = image;
    });
  }

  onLogOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  onClickTask() {
    this.router.navigate(['/task']);
  }
  onClickDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
