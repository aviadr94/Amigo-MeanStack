import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from '../angular-material.module';

import {MatGridListModule} from '@angular/material/grid-list';
import { SearchPipe } from './post-list/search.pipe';
import { SearchCityPipe } from './post-list/searchcity.pipe';
import { SearchRatePipe } from './post-list/searchRate.pipe';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, SearchPipe, SearchCityPipe, SearchRatePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatGridListModule,
  ]
})
export class PostsModule {}
