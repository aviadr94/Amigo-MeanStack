import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { City } from '../city.model';
import { CitiesService } from '../cities.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css']
})
export class CityListComponent implements OnInit, OnDestroy {

  @ViewChild('searchCity', {static: false}) searchCityInput: any;
  city = '';

  @ViewChild('searchLat', {static: false}) searchLatInput: any;
  lat = '';

  @ViewChild('searchLng', {static: false}) searchLngInput: any;
  lng = '';

  cities: City[] = [

  ];

  isLoading = false;
  totalCities = 0;
  citiesPerPage = 100;
  citieslength = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private citiesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public citiesService: CitiesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.citiesService.getCities(this.citiesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.citiesSub = this.citiesService
      .getCityUpdateListener()
      .subscribe((cityData: { cities: City[]; cityCount: number }) => {
        this.isLoading = false;
        this.totalCities = cityData.cityCount;
        this.cities = cityData.cities;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.citiesPerPage = pageData.pageSize;
    this.citiesService.getCities(this.citiesPerPage, this.currentPage);
  }

  onDelete(cityId: string) {
    this.isLoading = true;
    this.citiesService.deleteCity(cityId).subscribe(() => {
      this.citiesService.getCities(this.citiesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.citiesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onTextChangedCity() {
    this.city = this.searchCityInput.nativeElement.value;
    this.city = this.city.toLowerCase();
  }

  onTextChangedLat() {
    this.lat = this.searchLatInput.nativeElement.value;
    this.lat = this.lat.toLowerCase();
  }

  onTextChangedLng() {
    this.lng = this.searchLngInput.nativeElement.value;
    this.lng = this.lng.toLowerCase();
  }
}
