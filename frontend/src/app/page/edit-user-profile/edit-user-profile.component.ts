import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-user-profile',
  imports: [ReactiveFormsModule, NgIf, FormsModule],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css',
})
export class EditUserProfileComponent {
  constructor(public service: ApiService, public userservice: UserService) {}

  // @ViewChild(HeaderComponent) childheader!: HeaderComponent;

  // passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

  email = localStorage.getItem('email');
  userData: any;
  fileToUpload: any;
  profileImage: any;
  message: any;

  editForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl(this.email, [Validators.required, Validators.email]),
  });

  handleImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.fileToUpload = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profileImage = e.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  async convertImageUrlToFile(imageUrl: string, fileName: string) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const fileType = blob.type;
    return new File([blob], fileName, { type: fileType });
  }

  ngOnInit() {
    this.service.onGetUser({ email: this.email }).subscribe((res: any) => {
      this.userData = res.data;
      this.profileImage = res.image;

      this.convertImageUrlToFile(this.profileImage, 'image.jpg').then(
        (file) => {
          this.fileToUpload = file;
        }
      );
      this.editForm.patchValue({
        firstname: this.userData?.firstname,
        lastname: this.userData?.lastname,
      });
    });
  }

  onSubmit() {
    if (!this.fileToUpload) {
      this.message = 'No image selected';
      return;
    }
    if (this.editForm.valid) {
      const formData = new FormData();
      Object.keys(this.editForm.controls).forEach((key) => {
        const value = this.editForm.get(key)?.value;
        if (value !== null && value !== undefined && key !== 'image') {
          formData.append(key, value);
        }
      });

      formData.append('image', this.fileToUpload);
      console.log('Form Data:', Object.keys(formData));
      this.service.onUpdateUser(formData).subscribe((res: any) => {
        console.log('Response:', res);
        this.message = res.message;

        if (res.imagePath) {
          this.userservice.updateProfileImage(
            `http://localhost:4000${res.imagePath}`
          );
          localStorage.setItem(
            'imageUrl',
            `http://localhost:4000${res.imagePath}` || 'images/image.jpg'
          );
        }
      });
    }

    // this.editForm.patchValue({
    //   // image:this.fileToUpload,
    // });
    // if (this.editForm.get('image')?.value === undefined) {
    //   console.log('check', this.editForm.get('image')?.value === undefined);
    //   this.editForm.invalid;
    //   return;
    // }
    // if (this.editForm.valid) {
    //   this.formDataSend = this.editForm.value;

    //   const formData = new FormData();

    //   Object.keys(this.editForm.controls).forEach(key => {
    //     const value = this.editForm.get(key)?.value;
    //     if (value !== null && value !== undefined) {
    //       formData.append(key, value);
    //     }
    //   });

    //   if (this.fileToUpload) {
    //     formData.append("image", this.fileToUpload);
    //   }

    //   console.log(this.formDataSend.image);
    //   console.log(typeof this.formDataSend.image);
    //   console.log("formData",formData)
    //   this.service.onUpdateUser(formData).subscribe((res: any) => {
    //     // console.log('res', res);

    //   });
    // }

    // const formdata = new FormData();
    // formdata.append('image', this.fileToUpload);

    // console.log('img', this.fileToUpload);

    // Object.keys(this.editForm.controls).forEach(key => {
    //   const value = this.editForm.get(key)?.value;
    //   if (value !== null && value !== undefined) {
    //     formdata.append(key, value);
    //   }
    // });

    // console.log('photo',typeof(formdata) );
    // console.log('photo',formdata);

    // console.log('Photo Data:');
    // formdata.forEach((value, key) => {
    //   console.log(key, value);
    // });
  }
}
