import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private logger:LoggerService, private login: LoginService, private router : Router, private fb: FormBuilder) { }

  loginForm: FormGroup;
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]]
    })
  }

  public errorMsg: string = "";
  onSubmit(form: FormGroup) {
    this.logger.loggerInfo('Valid?' + form.valid); // true or false
    this.logger.loggerInfo('username=' + form.value.username);
    this.logger.loggerInfo('password=' + form.value.password);

    var username: string = form.value.username;
    this.login.getLoginDetais().subscribe((data:any) => {
      var empdata: any = data[username];
      this.logger.loggerInfo(empdata);
      if(empdata !== null && empdata !== undefined){
        var password: string = form.value.password;
        if(empdata.password === password){
          this.logger.loggerInfo(empdata.password + " == " + password);
          var role: string = empdata.role;
          if(role.toLocaleLowerCase() == "admin"){
            this.errorMsg = "";
            this.router.navigate(['/librarian-mode',username]);            
          } else {
            this.errorMsg = "";
            this.router.navigate(['/member-mode',username]);
          }
        } else {
          this.errorMsg = "Invalid Username or Password";
        }
      } else {
        this.errorMsg = "Employee does not exist";
      }
    });
  }

}
