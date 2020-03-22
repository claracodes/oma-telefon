import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  public showNotification(level: ('success' | 'error' | 'notice'), message: string, action: string = '', duration: number = 2000) {
    this.snackBar.open(message, action, {
      duration,
      panelClass: 'notification-' + level,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
}