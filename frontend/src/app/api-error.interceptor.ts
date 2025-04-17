import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  return next(req).pipe(
    catchError((error) => {
      let message = 'Something went wrong!';

      if (error.status === 0) {
        message = 'No Internet Connection';
      } else if (error.status === 401) {
        message = 'Unauthorized – Please login again.';
      } else if (error.status === 403) {
        message = 'Forbidden – You don’t have access.';
      } else if (error.status === 404) {
        message = 'Resource not found!';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      }
      toastr.error(message,error.message);
      // alert(message);
      return throwError(() => error);
    })
  );
};
