import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  @ViewChild('search,searchCity', {static: false}) searchInput: any;
  @ViewChild('searchCity', {static: false}) searchCityInput: any;
  @ViewChild('searchRate', {static: false}) searchRateInput: any;

  title = '';
  city = '';
  rating = '';

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 100;
  postslength = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userEmail: string;

  lastChar = '';
  flag = true;

  // tslint:disable-next-line: variable-name
  post_temp_title: string;
  // tslint:disable-next-line: variable-name
  post_temp_city: string;
  // tslint:disable-next-line: variable-name
  post_temp_content: string;

  checkPostCity(posts: Post[]) {
      this.lastChar = localStorage.getItem('lastSearchChar');
      for (const post of posts) {
        if (post.city.charAt(0).toLowerCase() === this.lastChar) {
          this.post_temp_title = post.title;
          this.post_temp_city = post.city;
          this.post_temp_content = post.content;
        }
    }
      return true;
  }

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userEmail = localStorage.getItem('userEmail');
        console.log('user email = ' + this.userEmail);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onTextChangedTitle() {
    this.title = this.searchInput.nativeElement.value;
    this.title = this.title.toLowerCase();
  }

  onTextChangedCity() {
    this.city = this.searchCityInput.nativeElement.value;
    this.city = this.city.toLowerCase();
    localStorage.setItem('lastSearch', this.city);
    localStorage.setItem('lastSearchChar', this.city.charAt(0).toLowerCase());
  }

  onTextChangedRate() {
    this.rating = this.searchRateInput.nativeElement.value;
    this.rating = this.rating.toLowerCase();
  }
}
