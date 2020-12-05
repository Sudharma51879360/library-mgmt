import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class BookBorrowStatusService {

    constructor(private logger: LoggerService, private http: HttpClient) { }

    getBooksBorrowDetailsByID(bookid) {
        return this.http.get(`http://localhost:3000/bookBorrowInfo/${bookid}`)
            .pipe(
                map((data: any) => {
                    //this.logger.loggerInfo("getBooksBorrowInfoByID=" + data);
                    return data;
                }), catchError(error => {
                    return throwError('Book Borrow Info not available for bookId : ' + bookid);
                })
            )
    }
   
    getBooksBorrowListByBookID(bookid) {
        return this.http.get(`http://localhost:3000/bookBorrowInfo/${bookid}`)
            .pipe(
                map((data: any) => {
                    this.logger.loggerInfo("getBooksBorrowListByBookID=" + data);
                    return data;
                }), catchError(error => {
                    return throwError('Book Borrow Info not available for bookId : ' + bookid);
                })
            )
    }

}