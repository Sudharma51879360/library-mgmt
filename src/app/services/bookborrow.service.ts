import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

@Injectable()
export class BookBorrowService {

    constructor(private logger: LoggerService, private http: HttpClient) { }

    getBooksBorrowInfo() {
        return this.http.get('http://localhost:3000/bookBorrowInfo').
            pipe(
                map((data: any) => {
                    //this.logger.loggerInfo(data);
                    return data;
                }), catchError(error => {
                    return throwError('Something went wrong!');
                })
            )
    }

    // getBooksBorrowStatus(username, bookid) {
    //     return this.http.get(`http://localhost:3000/bookBorrowInfo/${bookid}`)
    //         .pipe(
    //             map((data: any) => {
    //                 //this.logger.loggerInfo("getBooksBorrowStatus=" + data);
    //                 return data;
    //             }), catchError(error => {
    //                 return throwError('Book Borrow Info not available for bookId : ' + bookid);
    //             })
    //         )
    // }

    getBooksBorrowInfoByID(bookid) {
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

    addBooksBorrowInfo(jsonData) {
        this.http.post('http://localhost:3000/bookBorrowInfo', jsonData).subscribe(
            (response) => this.logger.loggerInfo(response),
            (error) => this.logger.loggerInfo(error)
        );
    }

    borrowBook(id, jsonData) {
        var url = `http://localhost:3000/bookBorrowInfo/${id}`;
        //this.logger.loggerInfo("url=" + url);
        this.http.put(`${url}`, jsonData).subscribe(
            (response) => this.logger.loggerInfo(response),
            (error) => this.logger.loggerInfo(error)
        );
    }

    returnBook(id, jsonData) {
        var url = `http://localhost:3000/bookBorrowInfo/${id}`;
        //this.logger.loggerInfo("url=" + url);
        this.http.put(`${url}`, jsonData).subscribe(
            (response) => this.logger.loggerInfo(response),
            (error) => this.logger.loggerInfo(error)
        );
    }

    approveBookBorrow(id, jsonData) {
        var url = `http://localhost:3000/bookBorrowInfo/${id}`;
        //this.logger.loggerInfo("url=" + url);
        this.http.put(`${url}`, jsonData).subscribe(
            (response) => this.logger.loggerInfo(response),
            (error) => this.logger.loggerInfo(error)
        );
    }

    rejectBookBorrow(id, jsonData) {
        var url = `http://localhost:3000/bookBorrowInfo/${id}`;
        //this.logger.loggerInfo("url=" + url);
        this.http.put(`${url}`, jsonData).subscribe(
            (response) => this.logger.loggerInfo(response),
            (error) => this.logger.loggerInfo(error)
        );
    }

    approveBookReturn(id, jsonData) {
        var url = `http://localhost:3000/bookBorrowInfo/${id}`;
        //this.logger.loggerInfo("url=" + url);
        this.http.put(`${url}`, jsonData).subscribe(
            (response) => this.logger.loggerInfo(response),
            (error) => this.logger.loggerInfo(error)
        );
    }

    rejectBookReturn(id, jsonData) {
        var url = `http://localhost:3000/bookBorrowInfo/${id}`;
        //this.logger.loggerInfo("url=" + url);
        this.http.put(`${url}`, jsonData).subscribe(
            (response) => this.logger.loggerInfo(response),
            (error) => this.logger.loggerInfo(error)
        );
    }
}