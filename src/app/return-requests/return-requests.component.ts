import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BookBorrow } from '../model/BookBorrow';
import { BookBorrowService } from '../services/bookborrow.service';
import { BookSearchService } from '../services/booksearch.service';
import { LoggerService } from '../services/logger.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-return-requests',
  templateUrl: './return-requests.component.html',
  styleUrls: ['./return-requests.component.scss']
})
export class ReturnRequestsComponent implements OnInit, AfterViewInit {

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

    this.showReturnRequests();

  }

  logoutUser() {
    this.router.navigate(['']);
  }

  public returnRequests = Array<BookBorrow>();
  showReturnRequests() {

    this.returnRequests = Array<BookBorrow>();

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
            if (borrower[3] == "true") {
              var bookReturnInfo = new BookBorrow();
              var bookdetails: string[] = [];
              bookReturnInfo.requestercode = borrower[0];
              bookReturnInfo.requestername = this.empdetails[borrower[0]].empname;
              //this.logger.loggerInfo('booksinfo[0] =>' + JSON.stringify(booksinfo));              
              bookdetails.push(booksinfo.bookname);              
              bookdetails.push(booksinfo.author);
              bookdetails.push(booksinfo.price);
              bookdetails.push(booksinfo.category);
              bookdetails.push(booksinfo.bookId);
              bookdetails.push(borrower[1]);
              bookdetails.push(booksinfo.img);              
              bookReturnInfo.bookdata = bookdetails;
              this.returnRequests.push(bookReturnInfo);
            }
          }          
        }
        this.logger.loggerInfo('returnRequests =>' + JSON.stringify(this.returnRequests));
      }
    });
    
  }

  modelbookid: string = "";
  modelbookname: string = "";
  modelrequestercode: string = "";
  modelrequestername: string = "";
  showReturnApproveModal: boolean = false;
  public openReturnApproveModel(bookId, bookName, requestercode, requestername) {
    if (0) {
      // Dont open the modal
      this.showReturnApproveModal = false;
    } else {
      // Open the modal
      this.modelbookid = bookId;
      this.modelbookname = bookName;
      this.modelrequestercode = requestercode;
      this.modelrequestername = requestername;
      this.showReturnApproveModal = true;
    }
  }

  returnBookApprove(bookid,requestercode){
    this.logger.loggerInfo('approve bookid =>' + bookid);
    this.logger.loggerInfo('approve requestercode =>' + requestercode);
    this.bookborrow.getBooksBorrowInfoByID(bookid).subscribe((borrowinfo: any) => {
      if ((borrowinfo != null && borrowinfo != undefined)) {
        var borrowerList = borrowinfo.borrower;
        var returnApproveUpdate: string[][] = [];
        for(var index in borrowerList){
          //this.logger.loggerInfo("approval index =" + index);
          var borrower = borrowerList[index];
          if(borrower[0] != requestercode){
            //this.logger.loggerInfo("approval borrower =" + borrower[0]);
            returnApproveUpdate.push(borrower);
          }
        }
        var jsonReturnApproveUpdate = { id: bookid, borrower: returnApproveUpdate };
        //this.logger.loggerInfo("jsonReturnApproveUpdate=" + JSON.stringify(jsonReturnApproveUpdate));
        this.bookborrow.approveBookReturn(bookid, jsonReturnApproveUpdate);
      }
    });

    setTimeout(() => { this.showReturnRequests(); }, 500);
  }

  showReturnRejectModal: boolean = false;
  public openReturnRejectModel(bookId, bookName, requestercode, requestername) {
    if (0) {
      // Dont open the modal
      this.showReturnRejectModal = false;
    } else {
      // Open the modal
      this.modelbookid = bookId;
      this.modelbookname = bookName;
      this.modelrequestercode = requestercode;
      this.modelrequestername = requestername;
      this.showReturnRejectModal = true;
    }
  }

  returnBookReject(bookid,requestercode){
    this.logger.loggerInfo('reject bookid =>' + bookid);
    this.logger.loggerInfo('reject requestercode =>' + requestercode);
    this.bookborrow.getBooksBorrowInfoByID(bookid).subscribe((borrowinfo: any) => {
      if ((borrowinfo != null && borrowinfo != undefined)) {
        var borrowerList = borrowinfo.borrower;
        for(var index in borrowerList){
          //this.logger.loggerInfo("reject index =" + index);
          var borrower = borrowerList[index];
          if(borrower[0] == requestercode){
            //this.logger.loggerInfo("borrower =" + borrower[0]);
            borrowerList[index][2]= "true";
            borrowerList[index][3]= "false";
            break;
          }
        }
        var jsonReturnRejectUpdate = { id: bookid, borrower: borrowerList };
        //this.logger.loggerInfo("jsonReturnRejectUpdate=" + JSON.stringify(jsonReturnRejectUpdate));
        this.bookborrow.rejectBookReturn(bookid, jsonReturnRejectUpdate);
      }
    });
    
    setTimeout(() => { this.showReturnRequests(); }, 500);
  }

}
