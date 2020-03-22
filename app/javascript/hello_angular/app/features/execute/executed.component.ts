import { Component, Input, Output, EventEmitter } from '@angular/core';
import templateString from './executed.component.html';
import './executed.component.scss';
import { Order } from 'hello_angular/app/services/types/order';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { executeOrderObject } from 'hello_angular/app/services/types/executeOrderObject';

@Component({
  selector: 'app-executed',
  template: templateString
})
export class ExecutedComponent  {

  @Input() order: Order;
  @Output() executedOrder: EventEmitter<executeOrderObject> = new EventEmitter<executeOrderObject>();

  constructor() { }

  executedForm = new FormGroup({
    total: new FormControl('', [Validators.required])
  });

  executeOrder(order: Order) {
    if (this.executedForm.valid) {
      const total = this.executedForm.get('total').value;
      console.log(total);
      this.executedOrder.emit({order, total});
    }
  }
  
}
