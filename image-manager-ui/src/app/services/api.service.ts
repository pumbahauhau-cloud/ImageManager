import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RatingEntry {
  name: string;
  tag: string;
  rating_Photo: number;
  rating_Light: number;
  rating_Background: number;
  rating_misc1: number;
  rating_misc2: number;
}
export interface Rating {
  folder: string;
  image: string;
  name: string;
  tag: string;
  ratingPhoto: number;
  ratingLight: number;
  ratingBackground: number;
  misc1: number;
  misc2: number;
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = 'https://localhost:7225/api';

  constructor(private http: HttpClient) { }

  /** FOLDER APIs */
  getFolders(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/folders`);
  }

 createFolder(folderName: string) {
  const backendUrl = 'https://localhost:7225/api/folders';
  return this.http.post(
    `${backendUrl}?name=${encodeURIComponent(folderName)}`,
    null,
    { responseType: 'text' } // <--- important
  );
}
getAllRatings() {
  // Assumes your backend exposes /ratings returning the full JSON
  return this.http.get<{ [key: string]: RatingEntry }>(`${this.baseUrl}/ratings`);
}

  deleteFolder(name: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/folders/${name}`);
  }

  /** IMAGE APIs */
  getImageUrl(folder: string, image: string): string {
    return `${this.baseUrl}/images/file?folder=${folder}&image=${image}`;
  }

  getImages(folder: string): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/images/${folder}`);
}


  uploadImages(folder: string, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('folder', folder);
    files.forEach(f => formData.append('files', f, f.name));

    return this.http.post(`${this.baseUrl}/images/upload`, formData);
  }

  moveImage(image: string, fromFolder: string, toFolder: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/images/move?image=${image}&fromFolder=${fromFolder}&toFolder=${toFolder}`, {});
  }

  /** RATING APIs */
  getRating(folder: string, image: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ratings?folder=${folder}&image=${image}`);
  }

  saveRating(rating: Rating): Observable<any> {
    // spread the properties except for folder and image to avoid duplicate keys
    const payload = {
      folder: rating.folder,
      image: rating.image,
      name: rating.name,
      tag: rating.tag,
      rating_Photo: rating.ratingPhoto,
      rating_Light: rating.ratingLight,
      rating_Background: rating.ratingBackground,
      rating_misc1: rating.misc1,
      rating_misc2: rating.misc2
    };
    return this.http.post(`${this.baseUrl}/ratings`, payload);
  }

  /** AUTH APIs */
  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { username, password });
  }

  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  clearToken() {
    localStorage.removeItem('jwt_token');
  }

  /** Helper to set Authorization header */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
