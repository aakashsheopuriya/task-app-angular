import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../customValidator/password.validator';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(public router:Router, public service:ApiService){}

  passwordVelidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  formdata: any;
  matched = false;
  message: any = '';

  signupForm = new FormGroup(
    {
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordVelidator),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      // role: new FormControl('', Validators.required),
    },
    {
      validators: [confirmPasswordValidator('password', 'confirmPassword')],
    }
  );
  
  onSubmit(){
    if (this.signupForm.valid) {
      this.formdata = this.signupForm.value;
      this.onSignUp();
      console.log(this.signupForm.controls);
      
    } else {
      Object.keys(this.signupForm.controls).forEach(field => { 
        const control = this.signupForm.get(field);  
        control?.markAsTouched({ onlySelf: true }); 
      });
    }
  }
  onSignUp() {
    this.service.onSignup(this.formdata).subscribe((res: any) => {
      this.message = res.message;
      if (res.status === 1) {
        this.router.navigate(['/login']);
      }
    });
  }
}
