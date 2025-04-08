import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    public service: ApiService,
    public userservices: UserService,
    public router: Router
  ) {}

  formData: any;
  message = '';

  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.formData = this.loginform.value;
    if (this.loginform.valid) {
      this.onLogin();
    } else {
      Object.keys(this.loginform.controls).forEach((field) => {
        const control = this.loginform.get(field);
        control?.markAsTouched();
      });
    }
  }
  onLogin() {
    this.service.onLogin(this.formData).subscribe((res: any) => {
      if (res.status === 1) {
        localStorage.setItem('email', this.formData.email);
        localStorage.setItem('token', res.token);
        this.message = res.message;
        this.router.navigate(['/dashboard']);
      } else {
        this.message = res.message;
      }
    });

    this.service
      .onGetUser({ email: this.loginform.get('email')?.value })
      .subscribe((res: any) => {
        localStorage.setItem('imageUrl', res.image || 'images/image.jpg');
        this.userservices.updateProfileImage(res.image || 'images/image.jpg');
      });
  }
}
