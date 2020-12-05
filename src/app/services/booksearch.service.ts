import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class BookSearchService{

    constructor(private logger:LoggerService, private http: HttpClient){}

    getBooksDetails() {
        return this.http.get('http://localhost:3000/BooksInfo').
        pipe(
            map((data: any) => {              
              //this.logger.loggerInfo(data);
              return data;
            }), catchError( error => {
              return throwError( 'Something went wrong!' );
            })
         )
    }
   
    getBookInfoByID(bookid) {
      var url = `http://localhost:3000/BooksInfo?bookId=${bookid}`;
      //this.logger.loggerInfo("url getBookInfoByID=" + url);
      return this.http.get(url)
          .pipe(
              map((data: any) => {
                  //this.logger.loggerInfo("getBookInfoByID=" + data);
                  return data;
              }), catchError(error => {
                  return throwError('Book Info not available for bookId : ' + bookid);
              })
          )
  }

}