import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-task',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  constructor(public service: ApiService) {}

  uidState = history.state?.uid;
  email = localStorage.getItem('email');
  formdata: any;
  taskData: any;
  userData: any;
  message: any;
  randomNumber: any;

  addTaskForm = new FormGroup({
    employeename: new FormControl('', Validators.required),
    email: new FormControl(this.email, Validators.required),
    task: new FormControl('', Validators.required),
    discription: new FormControl('', Validators.required),
    startdate: new FormControl('', Validators.required),
    enddate: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  ngOnInit() {
    if (this.uidState) {
      this.service
        .onGetTaskbyUid({ uid: this.uidState })
        .subscribe((res: any) => {
          console.log('res', res.data);
          this.addTaskForm.patchValue({
            employeename: res.data.employeename,
            task: res.data.task,
            discription: res.data.discription,
            startdate: res.data.startdate.split('T')[0],
            enddate: res.data.enddate.split('T')[0],
            status: res.data.status,
          });
        });
    }
  }

  generateRandomFun() {
    if (this.uidState) {
      this.randomNumber = this.uidState;
    } else {
      this.randomNumber = String(Math.floor(Math.random() * 999999));
      console.log('uid', this.randomNumber);
    }
  }

  onSubmit() {
    this.generateRandomFun();
    this.message = '';
    this.formdata = this.addTaskForm.value;
    this.formdata = Object.assign({ uid: this.randomNumber }, this.formdata);
    console.log(this.formdata);
    if (this.formdata.startdate <= this.formdata.enddate) {
      this.updateTask();
    } else {
      this.message = 'Task start date can not be greater then task end date';
    }
  }

  updateTask() {
    this.service.onAddTask(this.formdata).subscribe((res: any) => {
      console.log('res', res);
      console.log('formdata', this.formdata);
      this.message = res.message;
    });
  }
}
