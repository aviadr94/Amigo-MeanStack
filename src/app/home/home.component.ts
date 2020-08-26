import { Component, OnInit, AfterContentInit, AfterContentChecked } from '@angular/core';
import { Post } from '../posts/post.model';
import { Subscription, of } from 'rxjs';
import { PostsService } from '../posts/posts.service';
import { City } from '../city/city.model';
import { CitiesService } from '../city/cities.service';

interface CityCoordinates {
  cityname: string;
  lat: number;
  lng: number;
}

interface Coordinats {
  cityname: string;
  lat: string;
  lng: string;
}

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit , AfterContentInit , AfterContentChecked {
  title = 'angular-image-viewer';
  images = '/PictuesStyle/amigohomepage.jpeg';

  posts: Post[] = [

  ];

  totalPosts = 0;
  postsPerPage = 200;
  currentPage = 1;

  cities: City[] = [

  ];

  private citiesSub: Subscription;

  citiesPerPage = 100;
  currentCity = 1;

  constructor(
    public postsService: PostsService, public citiesService: CitiesService

  ) {}

  postsSub: Subscription;

  // Pie
  veryBad: number;
  bad: number;
  nice: number;
  veryGood: number;
  excellent: number;

  count: number;

  public pieChartLabelsRating: string[] = ['Very-Bad', 'Bad', 'Nice', 'Very Good', 'Excellent'];
  public pieChartDataRating: number[];
  public pieChartType = 'pie';

  batyam: number;
  rishon: number;
  telaviv: number;
  holon: number;

  WeatherData: any;

  public pieChartLabelsCity: string[] = ['Bat Yam', 'Holon', 'Rishon Lezion', 'Tel Aviv'];
  public pieChartDataCity: number[];
  public pieChartTypeCity = 'pie';


  coordinates: CityCoordinates[] = [
    {cityname: 'r' , lat : 31.968910 , lng : 34.770729 },
    {cityname: 'h' , lat : 32.011261 , lng : 34.774811 },
    {cityname: 'a' , lat : 31.804380 , lng : 34.655315 },
    {cityname: 'b' , lat : 32.016499 , lng : 34.750278 },
    {cityname: 'd' , lat : 31.028090 , lng : 35.361351 },
    {cityname: 'e' , lat : 29.550360 , lng : 34.952278 },
    {cityname: 't' , lat : 32.085300 , lng : 34.781769 },
    {cityname: 'n' , lat : 32.32095449078005 , lng : 34.85324768647013 }
  ];


  lastSearchChar: string;
  cityFirstChar: string;

  data: any;
show: boolean;


  latitude = 0;
  longtitude = 0;

  coor: Coordinats[] = [];

  setCitiesArray() {
    for (const city of this.cities) {
      this.latitude = +city.lat;
      this.longtitude = +city.lng;
      this.temp = {cityname: city.city.charAt(0).toLowerCase() , lat : this.latitude , lng: this.longtitude};
      this.coordinates.push(this.temp);
    }
    return true;
  }

    // tslint:disable-next-line: member-ordering
    temp: CityCoordinates;

  getWeatherData() {
    this.lastSearchChar = localStorage.getItem('lastSearchChar');
    for (const city of this.coordinates) {
      if (city.cityname === this.lastSearchChar) {
        console.log('cityname : ' + city.cityname);
        // tslint:disable-next-line: max-line-length
        fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + city.lat + '&lon=' + city.lng + '&appid=d42bddd01fb9b492a789c7897bec9409')
        .then(response => response.json())
        .then(data => {this.setWeatherData(data); } );
        return true;
      }
    }
        // tslint:disable-next-line: max-line-length
    fetch('http://api.openweathermap.org/data/2.5/weather?lat=31.968910&lon=34.770729&appid=e74655b6a29dde2a92d858c3c0334e95')
        .then(response => response.json())
        .then(data => {this.setWeatherData(data); } );
    return true;
  }

  setWeatherData(data: any) {
    this.WeatherData = data;
    const sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    const currentDate = new Date();
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0);
  }

  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
      });

    this.citiesService.getCities(this.citiesPerPage, this.currentPage);
    this.citiesSub = this.citiesService
          .getCityUpdateListener()
          .subscribe((cityDate: { cities: City[]; cityCount: number }) => {
            this.cities = cityDate.cities;
          });

    this.count = 0;

    this.WeatherData = {
      main : {},
      isDay: true
    };

    this.getWeatherData();

    // Muted Video
    document.getElementsByTagName('video')[0].muted = true;

  }

  ngAfterContentInit(): void {
    console.log('ng after content init');

  }

  ngAfterContentChecked(): void {
    this.setCitiesArray();
  }

// tslint:disable-next-line: align
GroupByCity() {
      this.postsService.getGroupBy().subscribe((d: any) => {
      console.log('data = ' + d);
      this.data = d;
      if (this.data.length === 0) {
        this.show = false;
      } else {
        this.show = true;
      }
      console.log('show = ' + this.show);
    });
  }

  // Pie Functions

readingRating(posts: Post[]) {
    this.pieData(posts);
  }

pieData(posts) {
    this.veryBad = 0;
    this.bad = 0;
    this.nice = 0;
    this.veryGood = 0;
    this.excellent = 0;

    this.rishon = 0;
    this.batyam = 0;
    this.holon = 0;
    this.telaviv = 0;

    for (const post of posts) {
      if (post.rating === '1-Very Bad') {
        this.veryBad ++;
      }
      if (post.rating === '2-Bad') {
        this.bad ++;
      }
      if (post.rating === '3-Nice') {
        this.nice ++;
      }
      if (post.rating === '4-Very Good') {
        this.veryGood ++;
      }
      if (post.rating === '5-Excellent') {
        this.excellent ++;
      }
      if (post.city === 'Bat Yam') {
        this.batyam ++;
      }
      if (post.city === 'Tel Aviv') {
        this.telaviv ++;
      }
      if (post.city === 'Holon') {
        this.holon ++;
      }
      if (post.city === 'Rishon Lezion') {
        this.rishon ++;
      }
    }
    this.pieChartDataRating = [this.veryBad, this.bad, this.nice, this.veryGood, this.excellent];
    this.pieChartDataCity = [this.batyam, this.holon, this.rishon, this.telaviv];
  }
}
