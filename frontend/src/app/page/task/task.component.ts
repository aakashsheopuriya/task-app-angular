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
import { NgFor, NgIf } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-task',
  imports: [
    ReactiveFormsModule,
    NgbDropdownModule,
    NgFor,
    NgIf,
    FormsModule,
    InfiniteScrollDirective,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  private offcanvasService = inject(NgbOffcanvas);
  constructor(public router: Router, public service: ApiService) {}

  data: any[] = [];
  allUsersData: any;
  userData: any;
  message: any;
  serchData: any;
  searchResult = false;
  noDataFound: any;
  localEmail = localStorage.getItem('email');
  page: number = 1;
  limit: number = 10;
  loading: boolean = false;
  total: number = 0;
  onInputChangeflag = false;
  onSearchFilterflag = false;
  onClickFilterCheckBoxflag = false;

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
    if (this.loading) return;
    this.loading = true;
    this.service
      .onGetLimitedTask(this.page, this.limit)
      .subscribe((res: any) => {
        if (res.status === 1) {
          this.data.push(...res.data);
          this.total = res.total;
          this.page++;
        }
        this.loading = false;
      });
  }

  getdata2() {
    if (this.loading) return;
    this.loading = true;
    this.service
      .onGetLimitedTask(this.page, this.limit)
      .subscribe((res: any) => {
        if (res.status === 1) {
          this.data = res.data;
          this.total = res.total;
          // this.page++;
        }
        this.loading = false;
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
      this.data = [];
      this.page = 1;
      this.getdata();
    }, 500);
  }

  onDelete(uid: any) {
    this.service.onDeleteTask({ uid: uid }).subscribe((res: any) => {
      console.log('delete', res);
    });

    setTimeout(() => {
      this.page = 1;
      this.data = [];
      this.getdata();
    }, 200);
  }

  onSearchFilter() {
    this.onSearchFilterflag = true;
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
      this.page = 1;
      this.service
        .onSearchTask(this.serchData, this.page, this.limit)
        .subscribe((res: any) => {
          if (res.data.length === 0) {
            this.page = 1;
            this.message = 'No result Found';
            this.noDataFound = false;
            this.searchResult = false;
            this.onSearchFilterflag = false;
            this.searchfilterform.patchValue({
              startdatefrom: null,
              startdateto: null,
              enddatefrom: null,
              enddateto: null,
              status: null,
              selectValue: null,
            });
          } else {
            this.onSearchFilterflag = true;
            this.searchResult = true;
            this.data = res.data;
            this.total = res.total;
            this.message = null;
            this.noDataFound = true;
          }
        });
      // this.searchfilterform.patchValue({
      //   startdatefrom: null,
      //   startdateto: null,
      //   enddatefrom: null,
      //   enddateto: null,
      //   status: null,
      //   selectValue: null,
      // });
    }
  }

  onSearchFilterScroll() {
    this.page++;
    this.onSearchFilterflag = true;
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
      this.service
        .onSearchTask(this.serchData, this.page, this.limit)
        .subscribe((res: any) => {
          if (res.data.length === 0) {
            this.onSearchFilterflag = false;
            this.searchResult = false;
            this.searchfilterform.patchValue({
              startdatefrom: null,
              startdateto: null,
              enddatefrom: null,
              enddateto: null,
              status: null,
              selectValue: null,
            });
          } else {
            this.searchResult = true;
            this.data.push(...res.data);
            this.total = res.total;
            console.log(this.data.length);
            this.message = null;
            this.noDataFound = true;
          }
        });
    }
  }

  // ---------

  selectAll: boolean = false;

  toggleAllCheckboxes() {
    this.allUsersData.forEach((user: any) => (user.selected = this.selectAll));
  }

  updateSelectAll() {
    this.selectAll = this.allUsersData.every((user: any) => user.selected);
  }

  onClickFilterCheckBox() {
    this.page = 1;
    this.onClickFilterCheckBoxflag = true;
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
      .onSearchTaskbyEmail(
        { selectedEmails: selectedEmails },
        this.page,
        this.limit
      )
      .subscribe((res: any) => {
        if (res.status == 1) {
          this.total = res.total;
          this.noDataFound = true;
          this.data = res.data;
          this.message = null;
          this.searchResult = true;
        } else {
          this.onClickFilterCheckBoxflag = false;
          this.searchResult = false;
          this.noDataFound = false;
          this.message = 'No result Found';
        }
      });
  }

  onClickFilterCheckBoxScroll() {
    this.page++;
    this.onClickFilterCheckBoxflag = true;
    const selectedEmails = this.allUsersData
      .filter((user: any) => user.selected)
      .map((user: any) => user.email);
    console.log('Selected emails:', selectedEmails);
    console.log(this.limit, this.page);
    this.service
      .onSearchTaskbyEmail(
        { selectedEmails: selectedEmails },
        this.page,
        this.limit
      )
      .subscribe((res: any) => {
        console.log('res', res);
        if (res.status == 1) {
          this.noDataFound = true;
          this.data.push(...res.data);
          this.message = null;
          this.searchResult = true;
        } else {
          this.onClickFilterCheckBoxflag = false;
          this.searchResult = false;
        }
      });
  }

  // ---------------
  inputValue: string = '';
  onInputChange(event: Event) {
    this.onInputChangeflag = true;
    this.inputValue = (event.target as HTMLInputElement).value;
    if (this.inputValue.length > 2) {
      setTimeout(() => {
        this.service
          .onSearchTaskbyName(
            { inputdata: this.inputValue },
            this.page,
            this.limit
          )
          .subscribe((res: any) => {
            console.log(res);
            if (res.status === 0) {
              this.data = [];
              this.page = 1;
              this.getdata2();
              this.searchResult = false;
              this.noDataFound = false;
              this.message = res.message;
              this.total = res.total;
              this.onInputChangeflag = false;
            } else {
              this.searchResult = true;
              this.noDataFound = true;
              this.data = res.data;
              this.message = null;
              this.total = res.total;
            }
          });
      }, 100);
    } else {
      this.searchResult = false;
      this.page = 1;
      this.getdata2();
      this.noDataFound = true;
      this.message = null;
    }
  }
  onInputChangeOnScroll() {
    if (this.inputValue.length > 2) {
      setTimeout(() => {
        this.page++;
        this.service
          .onSearchTaskbyName(
            { inputdata: this.inputValue },
            this.page,
            this.limit
          )
          .subscribe((res: any) => {
            console.log(res);
            if (res.status === 0) {
              this.onInputChangeflag = false;
              // this.data = [];
              // this.page = 1;
              // this.getdata2();
              this.searchResult = false;
              // this.noDataFound = false;
              // this.message = res.message;
              return;
            } else {
              this.total = res.total;
              this.searchResult = true;
              this.noDataFound = true;
              this.data.push(...res.data);
              this.message = null;
            }
          });
      }, 100);
    } else {
      this.searchResult = false;
      this.page = 1;
      this.getdata2();
      this.noDataFound = true;
      this.message = null;
    }
  }

  onEditTask(uid: any) {
    this.router.navigate(['/add-task'], { state: { uid: uid } });
  }

  refresh() {
    this.page = 1;
    this.data = [];
    this.getdata();
    this.message = '';
    this.noDataFound = true;
    this.searchResult = false;
    this.searchfilterform.patchValue({
      startdatefrom: null,
      startdateto: null,
      enddatefrom: null,
      enddateto: null,
      status: null,
      selectValue: null,
    });
    this.searchrform.patchValue({
      data: null,
    });
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

  onScroll() {
    console.log('scroll', this.data.length);
    console.log('tatal', this.total);
    if (
      this.data.length < this.total &&
      this.data.length > 9 &&
      this.searchResult === false
    ) {
      if (this.page == 1) {
        this.page++;
        this.getdata();
      } else {
        this.getdata();
      }
    } else if (
      this.total > 9 &&
      this.noDataFound === true &&
      this.searchResult === true
    ) {
      if (this.onInputChangeflag === true) {
        this.onInputChangeOnScroll();
      } else if (this.onSearchFilterflag === true) {
        this.onSearchFilterScroll();
      } else if (this.onClickFilterCheckBoxflag === true) {
        this.onClickFilterCheckBoxScroll();
      }
    } else if (this.message !== null) {
      return;
    }
  }
}
