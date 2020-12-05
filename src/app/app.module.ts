import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule} from '@angular/common/http';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { LoggerService } from './services/logger.service';
import { LoginService } from './services/login.service';
import { LibrarianModeComponent } from './librarian-mode/librarian-mode.component';
import { MemberModeComponent } from './member-mode/member-mode.component';
import { BookSearchService } from './services/booksearch.service';
import { BookBorrowService } from './services/bookborrow.service';
import { BookBorrowStatusService } from './services/bookborrowstatus.service';
import { BorrowRequestsComponent } from './borrow-requests/borrow-requests.component';
import { ReturnRequestsComponent } from './return-requests/return-requests.component';
//import { NgTooltip } from './tooltip/tooltip';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LibrarianModeComponent,
    MemberModeComponent,
    BorrowRequestsComponent,
    ReturnRequestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    //HttpClient,
    HttpClientModule
    ],
  providers: [LoggerService, LoginService, BookSearchService, BookBorrowService, BookBorrowStatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
