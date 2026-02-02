import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { redirectIfAuthGuard } from './guards/redirect-if-auth.guard';
import { SignIn } from './components/signIn/SignIn';
import { SignUp } from './components/signUp/signUp';
import { Home } from './components/home/home';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { About } from './components/about/about';
import { Submit } from './components/submit/submit';
import { Admin } from './components/admin/admin';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { Profile } from './components/profile/profile';
import { Overview } from './components/lost-found/overview/overview';
import { LostItemsList } from './components/lost-found/lost-items-list/lost-items-list';
import { FoundItemsList } from './components/lost-found/found-items-list/found-items-list';
import { ItemDetail } from './components/lost-found/item-detail/item-detail';
import { MyActivity } from './components/lost-found/my-activity/my-activity';


export const routes: Routes = [


  { path: 'signin', component: SignIn, canActivate: [redirectIfAuthGuard] },
  { path: 'signup', component: SignUp, canActivate: [redirectIfAuthGuard] },
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'submit', component: Submit, canActivate: [authGuard] },

  // Lost & Found Routes
  {
    path: 'lost-found',
    // canActivate: [authGuard],
    children: [
      { path: '', component: Overview },
      { path: 'lost', component: LostItemsList },
      { path: 'found', component: FoundItemsList },
      { path: 'my-activity', component: MyActivity, canActivate: [authGuard] },
      { path: 'item/:id', component: ItemDetail }
    ]
  },

  { path: 'Admin', component: Admin, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
