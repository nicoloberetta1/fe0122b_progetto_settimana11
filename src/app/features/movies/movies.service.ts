import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthData, AuthService } from 'src/app/auth/auth.service';
import { Favorite } from 'src/app/model/favorite';
import { Movie } from 'src/app/model/movie';
import { environment } from 'src/environments/environment';

export interface DashMovie {
  data: Movie;
  favId?: number;
  favIsLoading: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http: HttpClient, private authSrv: AuthService) {}
  async getPopularMovies(): Promise<DashMovie[]> {
    const user: AuthData = (await this.authSrv.user$
      .pipe(take(1))
      .toPromise()) as AuthData;
      console.log(user.accessToken);
    const movies = await this.http
      .get<Movie[]>(`${environment.apiBaseUrl}/movie/popular`)
      .toPromise();
      console.log(user.accessToken);
    const fav = await this.http
      .get<Favorite[]>(
        `${environment.apiBaseUrl}/favorites?userId=${user.user.id}`
      )
      .toPromise();
    return movies.map((m) => ({
      data: m,
      favIsLoading: false,
      favId: fav.find((f) => f.movieId == m.id)?.id,
    }));
  }

  async addFavorite(movieId: number) {
    const user: AuthData = (await this.authSrv.user$
      .pipe(take(1))
      .toPromise()) as AuthData;
    return this.http.post<Favorite>(`${environment.apiBaseUrl}/favorites`, {
      userId: user.user.id,
      movieId,
    });
  }
  removeFavorite(id: number) {
    return this.http.delete(`${environment.apiBaseUrl}/favorites/${id}`);
  }
}
