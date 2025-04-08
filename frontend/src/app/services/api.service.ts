import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}


// user routes
  onLogin(user: any): Observable<any> {
    const url = 'http://localhost:4000/user/login';
    return this.http.post(url, user);
  }
  onSignup(user: any): Observable<any> {
    const url = 'http://localhost:4000/user/signup';
    return this.http.post(url, user);
  }
  onUpdateUser(user: any): Observable<any> {
    const url = 'http://localhost:4000/user/update-user';
    return this.http.post(url, user);
  }
  onGetUser(user: any): Observable<any> {
    const url = 'http://localhost:4000/user/get-user';
    return this.http.post(url, user);
  }
  onGetAllUsers() {
    const url = 'http://localhost:4000/user/get-all-users';
    return this.http.get(url);
  }
  onDeleteUser(user: any): Observable<any> {
    const url = 'http://localhost:4000/user/delete-user';
    return this.http.post(url, user);
  }


  // task Routes
  onGetTask(user: any): Observable<any> {
    const url = 'http://localhost:4000/task/get-task';
    return this.http.post(url, user);
  }
  onGetTaskbyUid(user: any): Observable<any> {
    const url = 'http://localhost:4000/task/get-task-uid';
    return this.http.post(url, user);
  }
  onAddTask(user: any): Observable<any> {
    const url = 'http://localhost:4000/task/add-task';
    return this.http.post(url, user);
  }
  onGetAllTask() {
    const url = 'http://localhost:4000/task/get-all-task';
    return this.http.get(url);
  }
  onDeleteTask(user: any): Observable<any> {
    const url = 'http://localhost:4000/task/task-delete';
    return this.http.post(url, user);
  }
  onChangeStatus(user: any): Observable<any> {
    const url = 'http://localhost:4000/task/task-status-change';
    return this.http.post(url, user);
  }
  onSearchTask(user: any): Observable<any> {
    const url = 'http://localhost:4000/task/task-search';
    return this.http.post(url, user);
  }

  onSearchTaskbyName(user: any): Observable<any> {
    const url = 'http://localhost:4000/task/task-search-data';
    return this.http.post(url, user);
  }
  
  onSearchTaskbyEmail(user: any): Observable<any> {
    const url = 'http://localhost:4000/task/task-search-email-data';
    return this.http.post(url, user);
  }
}
