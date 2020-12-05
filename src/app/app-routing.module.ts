import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibrarianModeComponent } from './librarian-mode/librarian-mode.component';
import { LoginComponent } from './login/login.component';
import { MemberModeComponent } from './member-mode/member-mode.component';
import { BorrowRequestsComponent } from './borrow-requests/borrow-requests.component';
import { ReturnRequestsComponent } from './return-requests/return-requests.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'librarian-mode/:username', component: LibrarianModeComponent },
  { path: 'member-mode/:username', component: MemberModeComponent },
  { path: 'borrow-requests/:username', component: BorrowRequestsComponent },
  { path: 'return-requests/:username', component: ReturnRequestsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
