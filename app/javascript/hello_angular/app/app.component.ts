import { Component } from '@angular/core';
import templateString from './app.component.html';
import './app.component.scss';

@Component({
  selector: 'hello-angular',
  template: templateString
})
export class AppComponent {
  name = 'Angular!';

  test() {
    console.log('passed');
  }
}
