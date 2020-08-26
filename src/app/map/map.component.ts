import { Component, OnInit } from '@angular/core';
import { ConditionalExpr } from '@angular/compiler';
import { Marker } from '@agm/core';
import { Post } from '../posts/post.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { PostsService } from '../posts/posts.service';
import { MatTableDataSource } from '@angular/material';
import { InfoWindow } from '@agm/core/services/google-maps-types';
import { CitiesService } from '../city/cities.service';
import { City } from '../city/city.model';

interface CityCoordinates {
  cityname: string;
  lat: number;
  lng: number;
}

interface NewMarker {
  lat: number;
  lng: number;
}

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  lat = 31.968910;
  lng = 34.770729;
  zoom = 9;
  previous;

  posts: Post[] = [

  ];

  cities: City[] = [

  ];

  newmarker: NewMarker = null;

  private postsSub: Subscription;

  postsPerPage = 100;
  currentPage = 1;

  private citiesSub: Subscription;

  citiesPerPage = 100;
  currentCity = 1;

  coordinates: CityCoordinates[] = [
    {cityname: 'Rishon Lezion' , lat : 31.968910 , lng : 34.770729 },
    {cityname: 'Holon' , lat : 32.011261 , lng : 34.774811 },
    {cityname: 'Ashdod' , lat : 31.804380 , lng : 34.655315 },
    {cityname: 'Bat Yam' , lat : 32.016499 , lng : 34.750278 },
    {cityname: 'Beer Sheva' , lat : 31.252974 , lng : 34.791462 },
    {cityname: 'Dead Sea' , lat : 31.028090 , lng : 35.361351 },
    {cityname: 'Eilat' , lat : 29.550360 , lng : 34.952278 },
    {cityname: 'Haifa' , lat : 32.817280 , lng : 34.988762 },
    {cityname: 'Herzilya' , lat : 32.164860 , lng : 34.844170 },
    {cityname: 'Jerusalem' , lat : 31.768318 , lng : 35.213711 },
    {cityname: 'Kinneret' , lat : 32.722641 , lng : 35.567200 },
    {cityname: 'Tel Aviv' , lat : 32.085300 , lng : 34.781769 },
    // {cityname: 'Tiberias' , lat : 32.016499 , lng : 34.750278 },
    {cityname: 'Natanya' , lat : 32.329369 , lng : 34.856541 }
  ];

  placeMarker($event) {
    console.log('lat:' + $event.coords.lat);
    console.log('lng:' + $event.coords.lng);
    // this.coordinates.push({cityname: 'Omer' , lat : $event.coords.lat , lng : $event.coords.lat });
  }

  clickedMarker(infoWindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infoWindow;
 }

  constructor(
    public postsService: PostsService,
    public citiesService: CitiesService
  ) {}

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
      });

    // this.citiesService.getAllCities();
    // this.citiesSub = this.citiesService
    //       .getCityUpdateListener()
    //       .subscribe((cityDate: { cities: City[]; cityCount: number }) => {
    //         this.cities = cityDate.cities;
    //       });

    this.citiesService.getCities(this.citiesPerPage, this.currentPage);
    this.citiesSub = this.citiesService
        .getCityUpdateListener()
        .subscribe((cityDate: { cities: City[]; cityCount: number }) => {
          this.cities = cityDate.cities;
        });
  }


}
