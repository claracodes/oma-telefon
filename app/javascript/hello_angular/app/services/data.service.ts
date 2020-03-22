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
        if (Array.isArray(data) && data.length >= 1) {
          subject.next([data[0].lat, data[0].lon]);
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
    return this.http.get<Order[]>('/api/v1/orders?latitude=' + latitude + '&longitude=' + longitude);
  }

  public acceptOrder(order: Order) {
    return this.http.put('/api/v1/orders/' + order.id + '/accept', '');
  }

  public executeOrder(order: Order, total: number) {
    return this.http.put('/api/v1/orders/' + order.id + '/shopping_done', {total});
  }

  public deliverOrder(order: Order, money_received: boolean) {
    return this.http.put('/api/v1/orders/' + order.id + '/delivered', {money_received});
  }

  public getMyOrders() {
    return this.http.get<Order[]>('/api/v1/my_orders');
  }

  public logout() {
    return this.http.delete('/users/sign_out');
  }
  
}