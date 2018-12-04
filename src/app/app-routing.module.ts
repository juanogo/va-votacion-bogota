import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './home-layout/home-layout.component'
import { StorypageComponent } from './storypage/storypage.component';
import { ZonesComponent } from './storypage/zones/zones.component';
import { StoryHomeComponent } from './storypage/story-home/story-home.component';
import { PartiesComponent } from './storypage/parties/parties.component';

const routes: Routes = [{
  path: 'home',
  component: HomeLayoutComponent,
  data: { title: "Home" }
},
{
  path: 'story',
  component: StorypageComponent,
  data: { title: "Presentación" },
  children: [
    {
      path: 'home',
      component: StoryHomeComponent
    },
    {
      path: 'zones',
      component: ZonesComponent
    },
    {
      path: 'parties',
      component: PartiesComponent
    }
  ]
},
{
  path: '',
  redirectTo: '/story/home',
  pathMatch: 'full'
},
{
  path: '**',
  redirectTo: '/story/home',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
