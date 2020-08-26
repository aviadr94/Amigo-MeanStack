import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CityCreateComponent } from './city-create/city-create.component';
import { CityListComponent } from './city-list/city-list.component';
import { AngularMaterialModule } from '../angular-material.module';

import {MatGridListModule} from '@angular/material/grid-list';
import { SearchCityPipe } from './city-list/searchcity.pipe';
import { SearchLatPipe } from './city-list/searchlat.pipe';
import { SearchLngPipe } from './city-list/searchlng.pipe';


@NgModule({
  declarations: [CityCreateComponent, CityListComponent, SearchCityPipe, SearchLatPipe, SearchLngPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatGridListModule,
  ]
})
export class CitiesModule {}
