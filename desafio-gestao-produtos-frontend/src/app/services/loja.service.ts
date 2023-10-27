import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loja } from '../models/loja.model';

@Injectable({
  providedIn: 'root',
})
export class LojaService {
  apiURL = `http://localhost:3000/lojas`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Loja[]> {
    return this.http.get<Loja[]>(this.apiURL);
  }
}
