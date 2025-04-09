import {
  Component,
  inject,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import {
  NgbDropdownModule,
  NgbOffcanvas,
  OffcanvasDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [
    ReactiveFormsModule,
    NgbDropdownModule,
    NgFor,
    NgIf,
    FormsModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  private offcanvasService = inject(NgbOffcanvas);
  constructor(public router: Router, public service: ApiService) {}

  data: any;
  status: any;
  allUsersData: any;
  userData: any;
  message: any;
  userMessage: any;
  serchData: any;
  noDataFound: any;
  userImaage:any
  localEmail = localStorage.getItem('email');
  // userSignal:any

  searchfilterform = new FormGroup({
    selectValue: new FormControl(''),
    startdatefrom: new FormControl(null),
    startdateto: new FormControl(null),
    enddatefrom: new FormControl(null),
    enddateto: new FormControl(null),
    status: new FormControl(null),
  });

  searchrform = new FormGroup({
    data: new FormControl(null),
  });

  searchUser = new FormGroup({
    email: new FormControl(null),
  });

  ngOnInit() {
    this.getdata();
    this.getAllUsers();
    this.noDataFound = true;
  }

  isExpired(endDate: string): boolean {
    return new Date(endDate) < new Date();
  }

  onClick() {
    this.router.navigate(['/add-task']);
  }

  getdata() {
    this.service.onGetAllTask().subscribe((res: any) => {
      this.data = res.data;
    });
  }

  getAllUsers() {
    this.service.onGetAllUsers().subscribe((res: any) => {
      this.allUsersData = res.data;
    });
  }

  changeStatus(uid: any, value: any) {
    let statuschangedata = {
      uid: uid,
      status: value,
    };
    this.service.onChangeStatus(statuschangedata).subscribe((res: any) => {
      console.log('res', res);
    });
    setTimeout(() => {
      this.getdata();
    }, 500);
  }

  onDelete(uid: any) {
    this.service.onDeleteTask({ uid: uid }).subscribe((res: any) => {
      console.log('delete', res);
    });

    setTimeout(() => {
      this.getdata();
    }, 200);
  }

  onSearchFilter() {
    this.serchData = this.searchfilterform.value;
    if (
      this.searchfilterform.get('startdatefrom')?.value === null &&
      this.searchfilterform.get('startdateto')?.value === null &&
      this.searchfilterform.get('enddatefrom')?.value === null &&
      this.searchfilterform.get('enddateto')?.value === null &&
      this.searchfilterform.get('status')?.value === null
    ) {
      this.message = 'Search field is empty ';
      this.noDataFound = false;
    } else {
      console.log('this.serchData', this.searchfilterform.value);
      this.service.onSearchTask(this.serchData).subscribe((res: any) => {
        console.log(res);
        this.data = res.data;
        if (res.data.length === 0) {
          this.message = 'No result Found';
          this.noDataFound = false;
          this.getdata();
        } else {
          this.message = null;
          this.noDataFound = true;
        }
      });
      this.searchfilterform.patchValue({
        startdatefrom: null,
        startdateto: null,
        enddatefrom: null,
        enddateto: null,
        status: null,
        selectValue: null,
      });
    }
  }

  // onSearchUser(email: any) {
  //   this.service.onGetUser({ email }).subscribe((res: any) => {
  //     this.userData = res.data;
  //     this.userMessage = '';
  //     console.log(res);
  //     if (res.status === 0) {
  //       this.userMessage = res.message;
  //     }
  //   });
  // }

  // ---------

  selectAll: boolean = false;

  toggleAllCheckboxes() {
    this.allUsersData.forEach((user: any) => (user.selected = this.selectAll));
  }

  updateSelectAll() {
    this.selectAll = this.allUsersData.every((user: any) => user.selected);
  }

  onClickFilterButton() {
    const selectedEmails = this.allUsersData
      .filter((user: any) => user.selected)
      .map((user: any) => user.email);

    console.log('Selected emails:', selectedEmails);

    if (selectedEmails.length === 0) {
      this.noDataFound = false;
      this.message = 'Select at least one user';
      return;
    }

    this.service
      .onSearchTaskbyEmail({ selectedEmails: selectedEmails })
      .subscribe((res: any) => {
        console.log('res', res);
        if (res.status == 1) {
          console.log(res.data);
          this.noDataFound = true;
          this.data = res.data;
          this.message = null;
        } else {
          console.log(res.data);
          this.noDataFound = false;
          this.message = 'No result Found';
        }
      });
  }

  // onSearchByNameOrEmail(inputdata: any) {
  //   console.log('res', inputdata);
  //   if (!inputdata) {
  //     this.message = 'Field is Empty';
  //   } else {
  //     this.service.onSearchTaskbyName({ inputdata }).subscribe((res: any) => {
  //       console.log(res);
  //       if (res.status === 0) {
  //         this.message = res.message;
  //       } else {
  //         this.data = res.data;
  //         this.message = '';
  //       }
  //     });
  //   }
  // }

  inputValue: string = '';
  onInputChange(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
    if (this.inputValue.length > 2) {
      if (!this.inputValue) {
        this.message = 'Field is Empty';
      } else {
        setTimeout(() => {
          this.service
            .onSearchTaskbyName({ inputdata: this.inputValue })
            .subscribe((res: any) => {
              console.log(res);
              if (res.status === 0) {
                this.noDataFound = false;
                this.message = res.message;
              } else {
                this.noDataFound = true;
                this.data = res.data;
                this.message = null;
              }
            });
        }, 100);
      }
    } else {
      this.noDataFound = true;
      this.getdata();
      this.message = null;
    }
  }

  onEditTask(uid: any) {
    this.router.navigate(['/add-task'], { state: { uid: uid } });
  }

  onDeleteUser(email: any) {
    console.log(email);
    this.service.onDeleteUser({ email }).subscribe((res: any) => {
      console.log(res);
    });
    setTimeout(() => {
      this.getAllUsers();
    }, 100);
  }

  refresh() {
    this.getdata();
    this.message = '';
    this.noDataFound = true;
  }

  // offcanvas-----------

  closeResult: WritableSignal<string> = signal('');
  open(content: TemplateRef<any>) {
    this.offcanvasService
      .open(content, { ariaLabelledBy: 'offcanvas-basic-title' })
      .result.then(
        (result) => {
          this.closeResult.set(`Closed with: ${result}`);
        },
        (reason) => {
          this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case OffcanvasDismissReasons.ESC:
        return 'by pressing ESC';
      case OffcanvasDismissReasons.BACKDROP_CLICK:
        return 'by clicking on the backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
