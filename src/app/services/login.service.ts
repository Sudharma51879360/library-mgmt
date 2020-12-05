import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class LoginService{

    constructor(private logger:LoggerService, private http: HttpClient){}

    getLoginDetais() {
        return this.http.get('http://localhost:3000/loginInfo').
        pipe(
            map((data: any) => {              
              //this.logger.loggerInfo(data);
              return data;
            }), catchError( error => {
              return throwError( 'Something went wrong!' );
            })
         )
    }
}