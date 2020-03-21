import { Component, EventEmitter, Output } from '@angular/core';
import templateString from './start.component.html';
import './start.component.scss';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-start',
  template: templateString
})
export class StartComponent {

  adress: string;

  @Output() onAdressChange: EventEmitter<string> = new EventEmitter<string>();
  
  adressForm = new FormGroup({
    adress: new FormControl('', [Validators.required])
  });

  setAdress() {
    if (this.adressForm.valid) {
      this.adress = this.adressForm.get('adress').value;
      this.onAdressChange.emit(this.adress);
    }
  }

  resetForm() {
    this.adressForm.reset();
  }

}
