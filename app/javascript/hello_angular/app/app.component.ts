import { Component, ViewChild, NgZone } from '@angular/core';
import templateString from './app.component.html';
import './app.component.scss';
import 'leaflet/dist/leaflet.css';
import { DataService } from './services/data.service';
import { StartComponent } from './features/start/start.component';
import { NotificationService } from './services/notification.service';
import { marker, icon, Popup, Marker } from 'leaflet';
import { MapComponent } from './features/map/map.component';
import { MatButton } from '@angular/material/button';
import { Order } from './services/types/order';
import { executeOrderObject } from './services/types/executeOrderObject';
import { deliverOrderObject } from './services/types/deliverOrderObject';

@Component({
  selector: 'hello-angular',
  template: templateString
})
export class AppComponent {

  @ViewChild('start', { static: false }) startComponent: StartComponent;
  @ViewChild('map', { static: false }) mapComponent: MapComponent;

  ls_key = 'corony_adress';
  adress: string;
  lat: number;
  lon: number;
  layers: any;
  myOrders: Order[] = [];

  constructor(private dataService: DataService, private notificationService: NotificationService, public zone: NgZone) {
    const ls_adress = window.localStorage.getItem(this.ls_key);
    const ls_lat = window.localStorage.getItem(this.ls_key + '_lat');
    const ls_lon = window.localStorage.getItem(this.ls_key + '_lon');
    if (ls_adress) {
      if (ls_lat && ls_lon) {
        this.adress = ls_adress;
        this.lat = Number(ls_lat);
        this.lon = Number(ls_lon);
        this.getOrders();
      } else {
        this.onAdressChange(ls_adress);
      }
    }
  }

  resetAdress() {
    window.localStorage.removeItem(this.ls_key);
    window.localStorage.removeItem(this.ls_key + '_lat');
    window.localStorage.removeItem(this.ls_key + '_lon');
    window.location.reload();
  }

  onAdressChange(newAdress: string) {
    this.dataService.getAdressCoord(newAdress).subscribe(data => {
      if (data.length == 2) {
        this.adress = newAdress;
        this.lat = Number(data[0]);
        this.lon = Number(data[1]);
        window.localStorage.setItem(this.ls_key, newAdress);
        window.localStorage.setItem(this.ls_key + '_lat', data[0]);
        window.localStorage.setItem(this.ls_key + '_lon', data[1]);
        this.getOrders();
      } else {
        this.notificationService.showNotification('error', 'Adresse nicht gefunden. Bitte versuche es erneut.', '', 4000);
        this.startComponent.resetForm();
        if (window.localStorage.getItem(this.ls_key)) {
          window.localStorage.removeItem(this.ls_key);
        }
      }
    });
  }

  private getOrders() {
    this.getMyOrders();
    this.dataService.getOrders(this.lat, this.lon).subscribe(
      data => {
        const layers = [];
        for (const order of data) {
          const mark = marker([order.owner.latitude, order.owner.longitude], {
            icon: icon({
              iconSize: [25, 41],
              iconAnchor: [13, 41],
              iconUrl: 'marker-shadow.png',
              shadowUrl: 'marker-icon.png'
            }),
            title: order.list
          });
          const popup =
            `<p><b>Name: </b>` + order.owner.name + `</p>` +
            `<p><b>Einkaufsliste: </b>` + order.list + `</p>` +
            `<button class="acceptorder mat-focus-indicator mat-raised-button mat-button-base mat-primary">Auftrag annehmen</button>`
          mark.bindPopup(popup);
          mark.on('click', _ => {
            mark.openPopup()
          });
          mark.on('popupopen', (a) => {
            const popup = a.target.getPopup().getElement() as HTMLElement;
            popup.addEventListener('click', _ => {
              if ((_.target as HTMLElement).classList.contains('acceptorder')) {
                if (confirm('Auftrag wirklich annehmen?')) {
                  this.acceptOrder(order, mark);
                }
              }
            });
          });

          layers.push(mark)
        }
        this.layers = layers;
        console.log('new layers set to:');
        console.log(this.layers);
        this.mapComponent.invalidateSize();
      }
    );
  }

  private acceptOrder(order: Order, marker: Marker) {
    this.dataService.acceptOrder(order).subscribe(
      success => {
        this.getOrders();
        this.mapComponent.removeMarker(marker);
        this.zone.run(() => this.notificationService.showNotification('success', 'Super! Danke für das Annehmen des Auftrags!', '', 5000));
      },
      error => this.zone.run(() => this.notificationService.showNotification('error', 'Melde dich an um einen Auftrag anzunehmen.', '', 5000))
    );
  }


  private getMyOrders() {
    this.dataService.getMyOrders().subscribe(
      success => {
        this.mapComponent.updateMyOrders(success);
        console.log('new myOrders set to:');
        console.log(this.myOrders);
      },
      error => console.log('not loggedin')
    );
  }

  executeOrder(executeOrderObject: executeOrderObject) {
    console.log('executing order');
    this.dataService.executeOrder(executeOrderObject.order, executeOrderObject.total).subscribe(
      success => {
        console.log('getting orders');
        this.getMyOrders();
        this.zone.run(() => this.notificationService.showNotification('success', 'Super! Jetzt musst du nur noch den Einkauf abliefern!', '', 5000));
      },
      error => null
    );
  }

  deliverOrder(deliverOrderObject: deliverOrderObject) {
    this.dataService.deliverOrder(deliverOrderObject.order, deliverOrderObject.money_received).subscribe(
      success => {
        this.getMyOrders();
        if (deliverOrderObject.money_received) {
          this.zone.run(() => this.notificationService.showNotification('success', 'Super! Danke für deine Hilfe!', '', 5000));
        } else {
          this.zone.run(() => this.notificationService.showNotification('error', 'Danke für deine Hilfe! Bitte wende dich an unseren Support.', '', 10000));
        }
      },
      error => null
    );
  }

}