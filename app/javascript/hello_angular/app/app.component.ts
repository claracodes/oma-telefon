import { Component, ViewChild } from '@angular/core';
import templateString from './app.component.html';
import './app.component.scss';
import 'leaflet/dist/leaflet.css';
import { DataService } from './services/data.service';
import { StartComponent } from './features/start/start.component';
import { NotificationService } from './services/notification.service';
import { marker, icon } from 'leaflet';

@Component({
  selector: 'hello-angular',
  template: templateString
})
export class AppComponent {

  @ViewChild('start', { static: false }) startComponent: StartComponent;

  ls_key = 'corony_adress';
  adress: string;
  lat: number;
  lon: number;
  layers: any;

  constructor(private dataService: DataService, private notificationService: NotificationService) {
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
    console.log('Get orders with lat: '+this.lat+', lon: '+this.lon);
    this.dataService.getOrders(this.lat, this.lon).subscribe(
      data => {
        const layers = [];
        for (const task of data) {
          const mark = marker([task.owner.latitude, task.owner.longitude], {
            icon: icon({
              iconSize: [25, 41],
              iconAnchor: [13, 41],
              iconUrl: 'marker-shadow.png',
              shadowUrl: 'marker-icon.png'
            }),
            title: task.list
          });
          mark.bindPopup(`
          <p>Name: `+task.owner.email+`</p>
          <p>Einkaufsliste: `+task.list+`</p>`);
          mark.on('click', _ => {
            mark.openPopup()
          })
          layers.push(mark)
        }
        this.layers = layers;
        console.log(data);
      }
    );
  }

}