import { Component, OnInit } from '@angular/core';
import { DashMovie, MoviesService } from './movies.service';

@Component({
  selector: 'app-movies',
  template: `
    <style>
      .grid-container {
        margin: 20px;
      }
    </style>
    <div class="grid-container">
      <div fxLayout="row wrap" fxLayoutGap="20px grid">
        <div
          fxFlex="25%"
          fxFlex.xs="100%"
          fxFlex.sm="30%"
          *ngFor="let m of movies; let i = index"
        >
          <mat-card>
            <img
              mat-card-image
              [src]="'https://image.tmdb.org/t/p/w500' + m.data.poster_path"
              alt=""
            />
            <mat-card-content>
              <button
                mat-icon-button
                [color]="m.favId ? 'warn' : ''"
                [disabled]="m.favIsLoading"
                (click)="m.favId ? removeFav(m.favId, i) : addFav(m.data.id, i)"
              >
                <mat-icon>favorite</mat-icon>
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MoviesComponent implements OnInit {
  movies!: DashMovie[];
  constructor(private movieSrv: MoviesService) {}

  async ngOnInit() {
    this.movies = await this.movieSrv.getPopularMovies();
    console.log(this.movies);
  }

  async addFav(idM: number, i: number) {
    this.movies[i].favIsLoading = true;
    try {
      const newFav = await (await this.movieSrv.addFavorite(idM)).toPromise();
      this.movies[i].favIsLoading = false;
      this.movies[i] = {...this.movies[i],favId:newFav.id}
    } catch (error) {
      this.movies[i].favIsLoading = false;
      alert(error);
    }
  }
  async removeFav(idF: number, i: number) {
    this.movies[i].favIsLoading = true;
    try {
    await this.movieSrv.removeFavorite(idF).toPromise();
    this.movies[i].favIsLoading = false;
    this.movies[i] = {...this.movies[i],favId:undefined}
  } catch (error) {
    this.movies[i].favIsLoading = false;
    alert(error);
  }
  }
}
