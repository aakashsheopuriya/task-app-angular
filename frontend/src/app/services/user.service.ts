import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(public service: ApiService) {}
  ngOnInit() {}

  imageUrl = localStorage.getItem('imageUrl') || 'images/image.jpg';
  private profileImage = new BehaviorSubject<any>(this.imageUrl);

  profileImage$ = this.profileImage.asObservable();

  updateProfileImage(newImage: string) {
    this.profileImage.next(newImage);
  }
}
