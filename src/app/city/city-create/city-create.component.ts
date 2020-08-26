import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { CitiesService } from '../cities.service';
import { City } from '../city.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-city-create',
  templateUrl: './city-create.component.html',
  styleUrls: ['./city-create.component.css']
})

export class CityCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  city: City;
  isLoading = false;
  form: FormGroup;
  private mode = 'createcity';
  private cityId: string;
  private authStatusSub: Subscription;

  constructor(
    public citiesService: CitiesService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      city: new FormControl(null, { validators: [Validators.required] }),
      lat: new FormControl(null, { validators: [Validators.required] }),
      lng: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('cityId')) {
        this.mode = 'cityedit';
        this.cityId = paramMap.get('cityId');
        this.isLoading = true;
        this.citiesService.getCity(this.cityId).subscribe(cityData => {
          this.isLoading = false;
          this.city = {
            id: cityData._id,
            city: cityData.city,
            lat: cityData.lat,
            lng: cityData.lng,
            creator: cityData.creator
          };
          this.form.setValue({
            city: this.city.city,
            lat: this.city.lat,
            lng: this.city.lng
          });
        });
      } else {
        this.mode = 'createcity';
        this.cityId = null;
      }
    });
  }

  onSaveCity() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'createcity') {
      this.citiesService.addCity(
        this.form.value.city,
        this.form.value.lat,
        this.form.value.lng
      );
    } else {
      this.citiesService.updateCity(
        this.cityId,
        this.form.value.city,
        this.form.value.lat,
        this.form.value.lng
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
