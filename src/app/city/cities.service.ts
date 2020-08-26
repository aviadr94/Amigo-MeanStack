import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { City } from './city.model';

const BACKEND_URL = environment.apiUrl + '/cities/';

@Injectable({ providedIn: 'root' })
export class CitiesService {
  private cities: City[] = [];
  private citiesUpdated = new Subject<{ cities: City[]; cityCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCities(citiesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${citiesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; cities: any; maxCities: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(cityData => {
          return {
            cities: cityData.cities.map(city => {
              return {
                city: city.city,
                lat: city.lat,
                lng: city.lng,
                id: city._id,
                creator: city.creator
              };
            }),
            maxCities: cityData.maxCities
          };
        })
      )
      .subscribe(transformedCityData => {
        this.cities = transformedCityData.cities;
        this.citiesUpdated.next({
          cities: [...this.cities],
          cityCount: transformedCityData.maxCities
        });
      });
  }

  getAllCities() {
    this.http
      .get<{ message: string; cities: any; maxCities: number }>(
        BACKEND_URL + 'all'
      )
      .pipe(
        map(cityData => {
          return {
            cities: cityData.cities.map(city => {
              return {
                city: city.city,
                lat: city.lat,
                lng: city.lng,
                id: city._id,
                creator: city.creator
              };
            }),
            maxCities: cityData.maxCities
          };
        })
      );
      // .subscribe(transformedCityData => {
      //   this.cities = transformedCityData.cities;
      //   this.citiesUpdated.next({
      //     cities: [...this.cities],
      //     cityCount: transformedCityData.maxCities
      //   });
      // });
  }

  getCityUpdateListener() {
    return this.citiesUpdated.asObservable();
  }

  getCity(id: string) {
    return this.http.get<{
      _id: string;
      city: string,
      lat: string,
      lng: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addCity(city: string, lat: string, lng: string) {
    const cityData = new FormData();
    cityData.append('city', city);
    cityData.append('lat', lat);
    cityData.append('lng', lng);
    this.http
      .post<{ message: string; city: City }>(
        BACKEND_URL,
        cityData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateCity(id: string, city: string, lat: string, lng: string) {
    let cityData: City | FormData;
    cityData = new FormData();
    cityData.append('city', city);
    cityData.append('lat', lat);
    cityData.append('lng', lng);

    this.http
      .put(BACKEND_URL + id, cityData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteCity(cityId: string) {
    return this.http.delete(BACKEND_URL + cityId);
  }
}
