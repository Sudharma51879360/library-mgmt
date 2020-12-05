import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BookBorrow } from '../model/BookBorrow';
import { BookBorrowService } from '../services/bookborrow.service';
import { BookSearchService } from '../services/booksearch.service';
import { LoggerService } from '../services/logger.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-borrow-requests',
  templateUrl: './borrow-requests.component.html',
  styleUrls: ['./borrow-requests.component.scss']
})
export class BorrowRequestsComponent implements OnInit, AfterViewInit {

  constructor(private logger: LoggerService, private login: LoginService, private books: BookSearchService, private bookborrow: BookBorrowService, private router: Router, private activatedRoute: ActivatedRoute) { }

  today: Date = new Date();

  empdetails: any;
  public username: string = "";  
  public empdata: any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.logger.loggerInfo('member : ' + params.username);
        this.login.getLoginDetais().subscribe((data: any) => {
          this.logger.loggerInfo('member data : ' + data);
          this.empdetails = data;
          this.empdata = data[params.username];
          this.username = params.username;
        });
      }
    );
  }

  empname: string = "";
  ngAfterViewInit() {

    setTimeout(() => {
      //this.logger.loggerInfo('librarian empdata : ' + empdata);
      if (this.empdata !== null && this.empdata !== undefined) {
        this.empname = 'Welcome, ' + this.empdata.empname;
      }
    }, 500);

    this.showBorrowRequests();

  }

  logoutUser() {
    this.router.navigate(['']);
  }

  public borrowRequests = Array<BookBorrow>();
  showBorrowRequests() {

    this.borrowRequests = Array<BookBorrow>();

    var booksdetails: any;
    this.books.getBooksDetails().subscribe((result: any) => {
      if ((result != null && result != undefined)) {
        booksdetails = result;
      }
    });

    this.bookborrow.getBooksBorrowInfo().subscribe((data: any) => {
      if ((data != null && data != undefined)) {
        for (var i in data) {          
          var book = data[i];

          var booksinfo: any;
          for (var j in booksdetails) {
            var obj = booksdetails[j];
            if(obj.bookId == book.id){
              booksinfo = obj;
            }
          }

          var borrowers: string[][] = book.borrower;
          //this.logger.loggerInfo('bookID => ' + book.id +  ', borrowers =>' + JSON.stringify(borrowers));    
          for (var borrower of borrowers) {            
            if (borrower[2] == "false" && borrower[3] == "false") {
              var bookBorrowInfo = new BookBorrow();
              var bookdetails: string[] = [];
              bookBorrowInfo.requestercode = borrower[0];
              bookBorrowInfo.requestername = this.empdetails[borrower[0]].empname;
              //this.logger.loggerInfo('booksinfo[0] =>' + JSON.stringify(booksinfo));              
              bookdetails.push(booksinfo.bookname);              
              bookdetails.push(booksinfo.author);
              bookdetails.push(booksinfo.price);
              bookdetails.push(booksinfo.category);
              bookdetails.push(booksinfo.bookId);
              bookdetails.push(borrower[1]);
              bookdetails.push(booksinfo.img);              
              bookBorrowInfo.bookdata = bookdetails;
              this.borrowRequests.push(bookBorrowInfo);
            }
          }          
        }
        this.logger.loggerInfo('borrowRequests =>' + JSON.stringify(this.borrowRequests));
      }
    });
    
  }

  modelbookid: string = "";
  modelbookname: string = "";
  modelrequestercode: string = "";
  modelrequestername: string = "";
  showBorrowApproveModal: boolean = false;
  public openBorrowApproveModel(bookId, bookName, requestercode, requestername) {
    if (0) {
      // Dont open the modal
      this.showBorrowApproveModal = false;
    } else {
      // Open the modal
      this.modelbookid = bookId;
      this.modelbookname = bookName;
      this.modelrequestercode = requestercode;
      this.modelrequestername = requestername;
      this.showBorrowApproveModal = true;
    }
  }

  borrowBookApprove(bookid,requestercode){
    this.logger.loggerInfo('approval bookid =>' + bookid);
    this.logger.loggerInfo('approve requestercode =>' + requestercode);
    this.bookborrow.getBooksBorrowInfoByID(bookid).subscribe((borrowinfo: any) => {
      if ((borrowinfo != null && borrowinfo != undefined)) {
        var borrowApproveUpdate: string[][] = borrowinfo.borrower;
        for(var index in borrowApproveUpdate){
          //this.logger.loggerInfo("approval index =" + index);
          var borrower = borrowApproveUpdate[index];
          if(borrower[0] == requestercode){
            //this.logger.loggerInfo("approval borrower =" + borrower[0]);
            borrowApproveUpdate[index][2] = "true";
            break;
          }
        }
        var jsonBorrowApproveUpdate = { id: bookid, borrower: borrowApproveUpdate };
        //this.logger.loggerInfo("jsonBorrowApproveUpdate=" + JSON.stringify(jsonBorrowApproveUpdate));
        this.bookborrow.approveBookBorrow(bookid, jsonBorrowApproveUpdate);
      }
    });

    setTimeout(() => { this.showBorrowRequests(); }, 500);
  }

  showBorrowRejectModal: boolean = false;
  public openBorrowRejectModel(bookId, bookName, requestercode, requestername) {
    if (0) {
      // Dont open the modal
      this.showBorrowRejectModal = false;
    } else {
      // Open the modal
      this.modelbookid = bookId;
      this.modelbookname = bookName;
      this.modelrequestercode = requestercode;
      this.modelrequestername = requestername;
      this.showBorrowRejectModal = true;
    }
  }

  borrowBookReject(bookid,requestercode){
    this.logger.loggerInfo('reject bookid =>' + bookid);
    this.logger.loggerInfo('reject requestercode =>' + requestercode);
    this.bookborrow.getBooksBorrowInfoByID(bookid).subscribe((borrowinfo: any) => {
      if ((borrowinfo != null && borrowinfo != undefined)) {
        var borrowRequests: string[][] = borrowinfo.borrower;
        var borrowRejectUpdate: string[][] = [];
        for(var index in borrowRequests){
          //this.logger.loggerInfo("reject index =" + index);
          var borrower = borrowRequests[index];
          if(borrower[0] != requestercode){
            //this.logger.loggerInfo("borrower =" + borrower[0]);
            borrowRejectUpdate.push(borrower);
          }
        }
        var jsonBorrowRejectUpdate = { id: bookid, borrower: borrowRejectUpdate };
        //this.logger.loggerInfo("jsonBorrowRejectUpdate=" + JSON.stringify(jsonBorrowRejectUpdate));
        this.bookborrow.rejectBookBorrow(bookid, jsonBorrowRejectUpdate);
      }
    });
    
    setTimeout(() => { this.showBorrowRequests(); }, 500);
  }

}
