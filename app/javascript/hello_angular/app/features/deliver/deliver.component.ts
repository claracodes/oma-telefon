import { Component, Input, Output, EventEmitter } from '@angular/core';
import templateString from './deliver.component.html';
import './deliver.component.scss';
import { Order } from 'hello_angular/app/services/types/order';
import { deliverOrderObject } from 'hello_angular/app/services/types/deliverOrderObject';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-deliver',
  template: templateString
})
export class DeliverComponent  {

  checked = false;

  @Input() order: Order;
  @Output() deliveredOrder: EventEmitter<deliverOrderObject> = new EventEmitter<deliverOrderObject>();

  constructor() { }

  checkedChange(event: MatCheckboxChange) {
    this.checked = event.checked;
  }

  deliverOrder(order: Order) {
    const money_received = this.checked;
    this.deliveredOrder.emit({order, money_received});
  }
  
}
