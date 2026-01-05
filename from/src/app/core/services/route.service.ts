import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RouteDTO } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private apiUrl = `${environment.apiUrl}/route`;

  constructor(private http: HttpClient) {}

  getMyRoute(): Observable<RouteDTO[]> {
    return this.http.get<RouteDTO[]>(this.apiUrl);
  }
}
