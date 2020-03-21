import { Component, OnInit, Input } from '@angular/core';
import templateString from './map.component.html';
import { tileLayer, latLng } from 'leaflet';
import './map.component.scss';

@Component({
  selector: 'app-map',
  template: templateString
})
export class MapComponent implements OnInit {

  @Input() adress: string;
  @Input() lat: number;
  @Input() lon: number;
  @Input() layers: any;
  @Input() localStorageKey: string;
  options: any;
  adressNotFound = false;

  ngOnInit() {
    console.log(this.adress);
    if (this.adress) {
      this.options = {
        layers: [
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' })
        ],
        zoom: 12,
        center: latLng(this.lat, this.lon)
      };
    }

  }

  resetAdress() {
    if (this.localStorageKey) {
      window.localStorage.removeItem(this.localStorageKey);
      window.localStorage.removeItem(this.localStorageKey+'_lat');
      window.localStorage.removeItem(this.localStorageKey+'_lon');
    }
  }
  
}
