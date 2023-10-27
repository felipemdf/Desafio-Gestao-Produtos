import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showSnackbar(message: string, duration: number) {
    this.snackBar.open(message, 'Fechar', {
      duration: duration * 1000,
    });
  }
}
