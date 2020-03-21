import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Order } from './types/order';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  public getAdressCoord(adress: string) {
        const subject = new Subject<string[]>();
        this.http.get<any>('https://nominatim.openstreetmap.org/?q=' + adress + '&format=json').subscribe(
            data => {
                console.log(data);
                if (Array.isArray(data) && data.length >= 1) {
                    subject.next([data[0].lat,data[0].lon]);
                    subject.complete();
                } else {
                    subject.next([]);
                    subject.complete();
                }
            }
        );
        return subject.asObservable();
  }

  public getOrders(latitude: number, longitude: number) {
    return this.http.get<Order[]>('/api/v1/orders?latitude='+latitude+'&longitude='+longitude);
  }
}