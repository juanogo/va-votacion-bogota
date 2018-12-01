import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './home-layout/home-layout.component'

const routes: Routes = [{
  path: 'home',
  component: HomeLayoutComponent,
  data: { title: "Home" }
},
{
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
},
{
  path: '**',
  redirectTo: '/home',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
