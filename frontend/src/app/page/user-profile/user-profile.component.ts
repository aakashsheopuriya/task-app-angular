import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [NgIf, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  constructor(public service: ApiService) {}

  userData: any;
  email = localStorage.getItem('email');
  profileImage: any;
  showDefault: any;

  ngOnInit() {
    this.service.onGetUser({ email: this.email }).subscribe((res: any) => {
      this.userData = res.data;
      if (res.image) {
        this.profileImage = res.image;
      } else {
        this.profileImage = 'images/image.jpg';
      }
    });

    if (!this.profileImage) {
      this.showDefault = true;
    } else {
    }
  }
}
