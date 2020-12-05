import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BookBorrow } from '../model/BookBorrow';
import { BookBorrowService } from '../services/bookborrow.service';
import { BookBorrowStatusService } from '../services/bookborrowstatus.service';
import { BookSearchService } from '../services/booksearch.service';
import { LoggerService } from '../services/logger.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-librarian-mode',
  templateUrl: './librarian-mode.component.html',
  styleUrls: ['./librarian-mode.component.scss']
})
export class LibrarianModeComponent implements OnInit, AfterViewInit {

  constructor(private logger: LoggerService, private login: LoginService, private books: BookSearchService, private bookstatus: BookBorrowStatusService, private bookborrow: BookBorrowService, private router: Router, private activatedRoute: ActivatedRoute) { }

  today: Date = new Date();

  employees = new Map<string, any>();

  public username: string = "";
  public empdata: any;
  public bookList: any[] = [];
  public borrowerList = new Map<number, string[][]>();
  public bookCopies = new Map<number, number>();
  public membersList = new Map<string, Array<BookBorrow>>();
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.logger.loggerInfo('member : ' + params.username);
        this.login.getLoginDetais().subscribe((data: any) => {
          this.logger.loggerInfo('member data : ' + data);
          this.employees = data;
          this.empdata = data[params.username];
          this.username = params.username;
        });
      }
    );
  }

  showby: string = "B";
  empname: string = "";
  ngAfterViewInit() {

    setTimeout(() => {
      //this.logger.loggerInfo('librarian empdata : ' + empdata);
      if (this.empdata !== null && this.empdata !== undefined) {
        this.empname = 'Welcome, ' + this.empdata.empname;
      }
    }, 500);

    this.showBy(this.showby);

  }

  logoutUser() {
    this.router.navigate(['']);
  }
  
  showBy(value: string){
    this.logger.loggerInfo('show by : ' + value);
    this.showby = value;

    if(this.showby == 'B'){
      this.showAllBook();
    } else {
      this.showAllMembers();
    }

  }

  searchOpts: String[][] = [["A", "Author"], ["B", "Book Title"], ["C", "Category"]];
  searchOpt: string = "B";
  searchText: string = "";
  searchCatgs: String[] = ["Engineering", "Mathematics", "Law", "Commerce"];
  searchCatg: string = "Engineering";
  showAllBook() {
    this.searchOpt = "B";
    this.searchText = "";
    this.searchCatg = "Engineering";
    this.bookList = [];
    this.bookCopies = new Map<number, number>();
    this.borrowerList = new Map<number, string[][]>();
    this.books.getBooksDetails().subscribe((data: any) => {
      if ((data != null && data != undefined)) {
        for (var i in data) {
          var book = data[i];
          this.bookList.push(book);
          var bookId: number = book.bookId;
          this.bookCopies.set(bookId, book.copies);
          let borrowers: string[][] = [];
          this.bookstatus.getBooksBorrowListByBookID(bookId).subscribe((result: any) =>{            
            for(var borrower of result.borrower){
              borrowers.push(borrower)
            }            
          });
          this.borrowerList.set(bookId, borrowers);
        }
      }
    });

    this.generateBookCopiesAvailable();
    this.generateBookBorrowerList();

  }
  
  searchBook() {

    this.bookList = [];
    this.bookCopies = new Map<number, number>();
    this.borrowerList = new Map<number, string[][]>();
    this.logger.loggerInfo('searchOption=' + this.searchOpt);
    this.logger.loggerInfo('searchValue=' + this.searchText);
    this.books.getBooksDetails().subscribe((data: any) => {
      //this.logger.loggerInfo('bookBorrowDetails=' + data);
      if ((data != null && data != undefined) && (this.searchText != null && this.searchText != undefined)) {
        for (var i in data) {
          var book = data[i];
          var bookId: number = book.bookId;
          this.bookCopies.set(bookId, book.copies);
          var borrower: string[][] = [];
          this.bookstatus.getBooksBorrowListByBookID(bookId).subscribe((result: any) =>{borrower=result});
          this.borrowerList.set(bookId, borrower);
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

    this.generateBookCopiesAvailable();
    this.generateBookBorrowerList();

  }
  
  generateBookCopiesAvailable() {
    setTimeout(() => {
      for (let [key,value] of this.bookCopies) {
        this.bookstatus.getBooksBorrowDetailsByID(key).subscribe((data: any) => {
          if (data != null && data != undefined) {
            this.bookCopies.set(key, (value - data.borrower.length));
          }
        });
      }
      //this.logger.loggerInfo('bookCopies : ' + this.bookCopies);
    }, 500);
  }

  generateBookBorrowerList() {
    setTimeout(() => {
      
      this.login.getLoginDetais().subscribe((data: any) => {
        if (data != null && data != undefined) {
          for (let [key,value] of this.borrowerList) {
            //this.logger.loggerInfo('key : value = ' + key + " : " + value);
            var borrowerarr: string[][] = [];
            for(var ele of value) {     
              var borrowerdata: string[] = [];
              borrowerdata.push(ele[0]);
              var empdata: any = data[ele[0]];
              //this.logger.loggerInfo('empname : ' + empdata.empname);              
              borrowerdata.push(empdata.empname);
              if(ele[3] == "true") {
                borrowerdata.push(ele[1] + " - Requested for Return");
              }else{
                if(ele[2] == "true") {
                  borrowerdata.push(ele[1]);
                } else{
                  borrowerdata.push(ele[1] + " - Requested for Borrow");
                }
              }
              borrowerarr.push(borrowerdata);              
            }
            this.borrowerList.set(key, borrowerarr);
          }
        }
      });      
      this.logger.loggerInfo('borrowerList : ' + this.borrowerList);
    }, 500);
  }
  
  searchMemberTxt: string = "";
  showAllMembers(){
    this.searchMemberTxt = "";
    this.membersList = new Map<string, Array<BookBorrow>>();
    this.bookborrow.getBooksBorrowInfo().subscribe((data: any) => {
      if ((data != null && data != undefined)) {
        for (var i in data) {          
          var book = data[i];
          var borrowers: string[][] = book.borrower;
          for (var borrower of borrowers) { 
            var empcode = borrower[0]; 
            var empname = this.employees[empcode].empname;            
            var borrowedBookList = this.membersList.get(empname + " (" + empcode + ")"); 
            if(borrowedBookList == null || borrowedBookList == undefined){
              borrowedBookList = Array<BookBorrow>();
            }
             
            var bookdetails: string[] = [];
            bookdetails.push(book.id);
            bookdetails.push(borrower[1]);
            bookdetails.push(borrower[2]);
            bookdetails.push(borrower[3]);
            var bookBorrowInfo = new BookBorrow(); 
            bookBorrowInfo.requestercode = empcode;
            bookBorrowInfo.requestername = empname;
            bookBorrowInfo.bookdata = bookdetails;
            borrowedBookList.push(bookBorrowInfo);            
            this.membersList.set(empname + " (" + empcode + ")", borrowedBookList);
          }          
        }
        //this.logger.loggerInfo('JSONshowAllMembers ==> ' + this.membersList);  
      }
    });
      
    this.generateBorrowerMemberList();
    this.generateBookCopiesAvailable();

  }
  
  generateBorrowerMemberList(){
    var booksMap = new Map<string, any>();
  
    this.books.getBooksDetails().subscribe((data: any) => {
      if ((data != null && data != undefined)) {
        for(var book of data){ 
          booksMap.set(book.bookId, book);
        }          
      }
    });
    
    this.bookCopies = new Map<number, number>();
    setTimeout(() => {
      for(var [key,value] of this.membersList){
        this.logger.loggerInfo('key ==> ' + key);  
        this.logger.loggerInfo('value ==> ' + JSON.stringify(value));
        var borrowedBookList = this.membersList.get(key);
        for(var index in borrowedBookList){ 
          var borrowinfo = borrowedBookList[index];
          var book = booksMap.get(borrowinfo.bookdata[0]);
          var bookdetails: string[] = [];
          bookdetails.push(book.bookId);   
          bookdetails.push(book.bookname);              
          bookdetails.push(book.author);
          bookdetails.push(book.price);
          bookdetails.push(book.category);  
          bookdetails.push(book.copies);            
          bookdetails.push(book.img);
          if(borrowinfo.bookdata[3] == "true") {
            bookdetails.push(borrowinfo.bookdata[1] + " - Requested for Return");
          }else{
            if(borrowinfo.bookdata[2] == "true") {
              bookdetails.push(borrowinfo.bookdata[1]);
            } else{
              bookdetails.push(borrowinfo.bookdata[1] + " - Requested for Borrow");
            }
          }
          borrowinfo.bookdata = bookdetails; 

          this.bookCopies.set(book.bookId, book.copies);          
        }
        //this.logger.loggerInfo('finalBookBorrowList ==> ' + JSON.stringify(borrowedBookList));
        this.membersList.set(key, borrowedBookList);
      }      
    }, 500);
  }

  searchMember(){
    this.logger.loggerInfo('searchMemberTxt=' + this.searchMemberTxt);
    this.membersList = new Map<string, Array<BookBorrow>>();
    this.bookborrow.getBooksBorrowInfo().subscribe((data: any) => {
      if ((data != null && data != undefined) && (this.searchMemberTxt != null && this.searchMemberTxt != undefined)) {
        for (var i in data) {          
          var book = data[i];
          var borrowers: string[][] = book.borrower;
          for (var borrower of borrowers) { 
            var empcode = borrower[0]; 
            var empname = this.employees[empcode].empname;
            if (empname.trim().toLowerCase().includes(this.searchMemberTxt.trim().toLowerCase()) ||
            empcode.trim().toLowerCase().includes(this.searchMemberTxt.trim().toLowerCase())) {
              var borrowedBookList = this.membersList.get(empname + " (" + empcode + ")"); 
              if(borrowedBookList == null || borrowedBookList == undefined){
                borrowedBookList = Array<BookBorrow>();
              }
              
              var bookdetails: string[] = [];
              bookdetails.push(book.id);
              bookdetails.push(borrower[1]);
              bookdetails.push(borrower[2]);
              bookdetails.push(borrower[3]);
              var bookBorrowInfo = new BookBorrow(); 
              bookBorrowInfo.requestercode = empcode;
              bookBorrowInfo.requestername = empname;
              bookBorrowInfo.bookdata = bookdetails;
              borrowedBookList.push(bookBorrowInfo);            
              this.membersList.set(empname + " (" + empcode + ")", borrowedBookList);
            }
          }          
        }
        //this.logger.loggerInfo('JSONshowAllMembers ==> ' + this.membersList);  
      }
    });
      
    this.generateBorrowerMemberList();
    this.generateBookCopiesAvailable();

  }


}
