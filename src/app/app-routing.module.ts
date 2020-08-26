import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { AboutComponent } from './about/about.component';
import { CityListComponent } from './city/city-list/city-list.component';
import { CityCreateComponent } from './city/city-create/city-create.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', component: PostListComponent },
  { path: 'citylist', component: CityListComponent },
  { path: 'postcreate', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'citycreate', component: CityCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'cityedit/:cityId', component: CityCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  { path: 'map', component: MapComponent},
  { path: 'chat', component: ChatComponent},
  { path: 'aboutus', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
