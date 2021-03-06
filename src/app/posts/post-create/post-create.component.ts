import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from '../../auth/auth.service';
import { City } from 'src/app/city/city.model';
import { CitiesService } from 'src/app/city/cities.service';

interface CityType {
  value: string;
  viewValue: string;
}

interface Rate {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'postcreate';
  private postId: string;
  private authStatusSub: Subscription;

  rates: Rate[] = [
    {value: '1-Very Bad', viewValue: '1-Very Bad'},
    {value: '2-Bad', viewValue: '2-Bad'},
    {value: '3-Nice', viewValue: '3-Nice'},
    {value: '4-Very Good', viewValue: '4-Very Good'},
    {value: '5-Excellent', viewValue: '5-Exellent'}
  ];

  // cities: CityType[] =
  // [
  //   {value: 'Ashdod', viewValue: 'Ashdod'},
  //   {value: 'Bat Yam', viewValue: 'Bat Yam'},
  //   {value: 'Beer Sheva', viewValue: 'Beer Sheva'},
  //   {value: 'Dead Sea', viewValue: 'Dead Sea'},
  //   {value: 'Eilat', viewValue: 'Eilat'},
  //   {value: 'Haifa', viewValue: 'Haifa'},
  //   {value: 'Holon', viewValue: 'Holon'},
  //   {value: 'Herzilya', viewValue: 'Herzilya'},
  //   {value: 'Jerusalem', viewValue: 'Jerusalem'},
  //   {value: 'Kinneret', viewValue: 'Kinneret'},
  //   {value: 'Natanya', viewValue: 'Natanya'},
  //   {value: 'Rishon Lezion', viewValue: 'Rishon Lezion'},
  //   {value: 'Tel Aviv', viewValue: 'Tel Aviv'},
  //   {value: 'Tiberias', viewValue: 'Tiberias'}
  // ];

  cities: City[] = [

  ];

  private citiesSub: Subscription;

  citiesPerPage = 100;
  currentPage = 1;


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public citiesService: CitiesService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.citiesService.getCities(this.citiesPerPage, this.currentPage);
    this.citiesSub = this.citiesService
          .getCityUpdateListener()
          .subscribe((cityDate: { cities: City[]; cityCount: number }) => {
            this.cities = cityDate.cities;
          });

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      city: new FormControl(null, { validators: [Validators.required] }),
      rating: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            city: postData.city,
            rating: postData.rating,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            city: this.post.city,
            rating: this.post.rating,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'postcreate';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'postcreate') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.city,
        this.form.value.rating,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.city,
        this.form.value.rating,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
