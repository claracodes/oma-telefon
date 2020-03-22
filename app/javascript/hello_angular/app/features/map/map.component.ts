import { Component, OnInit, Input, NgZone, Output, EventEmitter } from '@angular/core';
import templateString from './map.component.html';
import { tileLayer, latLng, Map, Marker } from 'leaflet';
import './map.component.scss';
import { Order } from 'hello_angular/app/services/types/order';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { executeOrderObject } from 'hello_angular/app/services/types/executeOrderObject';
import { deliverOrderObject } from 'hello_angular/app/services/types/deliverOrderObject';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-map',
  template: templateString
})
export class MapComponent implements OnInit {

  @Input() adress: string;
  @Input() lat: number;
  @Input() lon: number;
  @Input() layers: any;
  myOrders: Order[];
  options: any;
  adressNotFound = false;
  map: Map;
  checked = false;

  @Output() executedOrder: EventEmitter<executeOrderObject> = new EventEmitter<executeOrderObject>();
  @Output() deliveredOrder: EventEmitter<deliverOrderObject> = new EventEmitter<deliverOrderObject>();

  constructor(public zone: NgZone) { }

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

  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  removeMarker(marker: Marker) {
    if (this.map.hasLayer(marker)) {
      this.map.removeLayer(marker);
    }
  }

  updateMyOrders(orders: Order[]) {
    this.zone.run(() => this.myOrders = orders)
    console.log('my orders updated in component');
    console.log(this.myOrders);
  }

  checkedChange(event: MatCheckboxChange) {
    this.checked = event.checked;
  }

  executeOrder(executeOrderObject: executeOrderObject) {
    this.executedOrder.emit(executeOrderObject);
  }

  deliverOrder(deliverOrderObject: deliverOrderObject) {
    this.deliveredOrder.emit(deliverOrderObject);
  }
  
}
