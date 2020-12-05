import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BookBorrowService } from '../services/bookborrow.service';
import { BookSearchService } from '../services/booksearch.service';
import { LoggerService } from '../services/logger.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-member-mode',
  templateUrl: './member-mode.component.html',
  styleUrls: ['./member-mode.component.scss']
})

export class MemberModeComponent implements OnInit, AfterViewInit {

  constructor(private logger: LoggerService, private login: LoginService, private books: BookSearchService, private bookborrow: BookBorrowService, private router: Router, private activatedRoute: ActivatedRoute) { }

  public today: Date = new Date();

  public username: string = "";
  public empdata: any;
  public bookList: any[] = [];
  public bookBorrowStatus = new Map<number, number>();
  public bookCopies = new Map<number, number>();
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.logger.loggerInfo('member : ' + params.username);
        this.login.getLoginDetais().subscribe((data: any) => {
          this.logger.loggerInfo('member data : ' + data);
          this.empdata = data[params.username];
          this.username = params.username;
        });
      }
    );
  }

  empname: string = "";
  ngAfterViewInit() {

    setTimeout(() => {
      this.logger.loggerInfo('member empdata : ' + this.empdata);
      if (this.empdata !== null && this.empdata !== undefined) {
        this.empname = 'Welcome, ' + this.empdata.empname;
      }
    }, 500);

    this.showAll();
   
  }

  logoutUser() {
    this.router.navigate(['']);
  }

  generateBookBorrowStatus() {
    setTimeout(() => {
      for (let key of this.bookBorrowStatus.keys()) {
        this.bookborrow.getBooksBorrowInfoByID(key).subscribe((data: any) => {
          var status: number = -1;
          var borrowers: string[][] = data.borrower;
          for(var borrower of borrowers) { 
            //console.log("Borrow Data : " + JSON.stringify(borrower));      
            if ((borrower[0] == this.username) && (borrower[3] == "true")) {           
              status =  2;
              break;
            } else {
              if ((borrower[0] == this.username) && (borrower[2] == "true")) {
                status =  1;
                break;
              } if ((borrower[0] == this.username) && (borrower[2] == "false")) {
                status =  0;
                break;
              } else {
                status =  -1;
              }
            }
          }
          this.bookBorrowStatus.set(key, status);
        });
      }
      //this.logger.loggerInfo('bookBorrowStatus : ' + this.bookBorrowStatus);
    }, 500);
  }

  generateBookCopiesAvailable() {
    setTimeout(() => {
      for (let [key,value] of this.bookCopies) {
        this.bookborrow.getBooksBorrowInfoByID(key).subscribe((data: any) => {
          if (data != null && data != undefined) {
            this.bookCopies.set(key, (value - data.borrower.length));
          }
        });
      }
      //this.logger.loggerInfo('bookCopies : ' + this.bookCopies);
    }, 500);
  }

  searchOpts: String[][] = [["A", "Author"], ["B", "Book Title"], ["C", "Category"]];
  searchOpt: string = "B";
  searchText: string = "";
  searchCatgs: String[] = ["Engineering", "Mathematics", "Law", "Commerce"];
  searchCatg: string = "Engineering";
  searchBook() {

    this.bookList = [];
    this.bookBorrowStatus = new Map<number, number>();
    this.bookCopies = new Map<number, number>();
    this.logger.loggerInfo('searchOption=' + this.searchOpt);
    this.logger.loggerInfo('searchValue=' + this.searchText);
    this.books.getBooksDetails().subscribe((data: any) => {
      //this.logger.loggerInfo('bookDetails=' + data);
      if ((data != null && data != undefined) && (this.searchText != null && this.searchText != undefined)) {
        for (var i in data) {
          var book = data[i];
          var bookId: number = book.bookId;
          this.bookBorrowStatus.set(bookId, -1);
          this.bookCopies.set(bookId, book.copies);
          if (this.searchOpt == "A") {
            var author: string = book.author;
            //this.logger.loggerInfo('author=' + author);
            if (author.trim().toLowerCase().includes(this.searchText.trim().toLowerCase())) {
              this.bookList.push(book);
            }
          } else if (this.searchOpt == "B") {
            var title: string = book.bookname;
            //this.logger.loggerInfo('title=' + title);
            if (title.trim().toLowerCase().includes(this.searchText.trim().toLowerCase())) {
              this.bookList.push(book);
            }
          } else if (this.searchOpt == "C") {
            var category: string = book.category;
            //this.logger.loggerInfo('category=' + category);
            if (category.trim().toLowerCase().match(this.searchCatg.trim().toLowerCase())) {
              this.bookList.push(book);
            }
          }
        }
      }
    });

    this.logger.loggerInfo('bookList=' + this.bookList);

    this.generateBookBorrowStatus();
    this.generateBookCopiesAvailable();

  }

  showAll() {
    this.searchOpt = "B";
    this.searchText = "";
    this.searchCatg = "Engineering";
    this.bookList = [];
    this.bookBorrowStatus = new Map<number, number>();
    this.bookCopies = new Map<number, number>();
    this.books.getBooksDetails().subscribe((data: any) => {
      if ((data != null && data != undefined)) {
        for (var i in data) {
          var book = data[i];
          this.bookList.push(book);
          var bookId: number = book.bookId;
          this.bookBorrowStatus.set(bookId, -1);
          this.bookCopies.set(bookId, book.copies);
        }
      }
    });

    this.generateBookBorrowStatus();
    this.generateBookCopiesAvailable();

  }

  confbookid: string = "";
  confbookname: string = "";
  showBorrowConfModal: boolean = false;
  public openBorrowConfModel(bookId, bookName) {
    if (0) {
      // Dont open the modal
      this.showBorrowConfModal = false;
    } else {
      // Open the modal
      this.confbookid = bookId;
      this.confbookname = bookName;
      this.showBorrowConfModal = true;
    }
  }

  borrowBook(bookId: number) {
    this.showBorrowConfModal = false;
    this.logger.loggerInfo('borrow bookId=' + bookId);

    var bookcopycodes: string[] = [];
    this.books.getBookInfoByID(bookId).subscribe((book: any) => {    
      bookcopycodes = book[0].copycodes;
      this.logger.loggerInfo('bookcopycodes --> ' + bookcopycodes);
    });

    this.bookborrow.getBooksBorrowInfo().subscribe((data: any) => {
      if ((data != null && data != undefined)) {
        this.logger.loggerInfo('borrow data=' + data);

        var borrowinfo: any;
        for (var i in data) {
          var borrowdata = data[i];
          if (borrowdata.id == bookId) {
            borrowinfo = borrowdata;
            break;
          }
        }

        this.logger.loggerInfo('borrowinfo=' + borrowinfo);
        if (borrowinfo != null && borrowinfo != undefined) {
          var borrowersUpdate: string[][] = borrowinfo.borrower;
          var bookborrowdetails: string[] = [];
          bookborrowdetails.push(this.username);
          var borrowedbookcopycodes: string[] = [];
          for(var j in borrowersUpdate){
            borrowedbookcopycodes.push(borrowersUpdate[j][1]);                       
          }             
          for(var copycode of bookcopycodes) {
            if(!borrowedbookcopycodes.includes(copycode)){
              bookborrowdetails.push(copycode);
              break;
            }
          }            
          bookborrowdetails.push("false");
          bookborrowdetails.push("false");
          borrowersUpdate.push(bookborrowdetails);
          var jsonDataUpdate = { id: bookId, borrower: borrowersUpdate };
          //this.logger.loggerInfo("jsonDataUpdate=" + JSON.stringify(jsonDataUpdate));
          this.bookborrow.borrowBook(bookId, jsonDataUpdate);
        } else {
          var borrowersAdd: string[][] = [];
          var bookborrowdetails: string[] = [];
          bookborrowdetails.push(this.username);
          this.logger.loggerInfo('bookcopycodes[0] --> ' + bookcopycodes[0]);
          bookborrowdetails.push(bookcopycodes[0]);
          bookborrowdetails.push("false");
          bookborrowdetails.push("false");
          borrowersAdd.push(bookborrowdetails);
          var jsonDataAdd = { id: bookId, borrower: borrowersAdd };
          //this.logger.loggerInfo("jsonDataAdd=" + jsonDataAdd);
          this.bookborrow.addBooksBorrowInfo(jsonDataAdd);
        }

      }
    });

    setTimeout(() => { this.searchBook(); }, 500);
  }

  showReturnConfModal: boolean = false;
  public openReturnConfModel(bookId, bookName) {
    if (0) {
      // Dont open the modal
      this.showReturnConfModal = false;
    } else {
      // Open the modal
      this.confbookid = bookId;
      this.confbookname = bookName;
      this.showReturnConfModal = true;
    }
  }

  returnBook(bookId: number) {
    this.showReturnConfModal = false;
    this.logger.loggerInfo('return bookId=' + bookId);

    this.bookborrow.getBooksBorrowInfoByID(bookId).subscribe((borrowinfo: any) => {
      if ((borrowinfo != null && borrowinfo != undefined)) {
        var borrowersReturnUpdate: string[][] = borrowinfo.borrower;
        for(var index in borrowersReturnUpdate){        
          if(borrowersReturnUpdate[index][0] == this.username){
            borrowersReturnUpdate[index][2] = "false";
            borrowersReturnUpdate[index][3] = "true";
            break;
          }
        }
        var jsonDataUpdate = { id: bookId, borrower: borrowersReturnUpdate };
        //this.logger.loggerInfo("jsonDataUpdate=" + JSON.stringify(jsonDataUpdate));
        this.bookborrow.returnBook(bookId, jsonDataUpdate);
      }
    });

    setTimeout(() => { this.searchBook(); }, 500);
  }

}
