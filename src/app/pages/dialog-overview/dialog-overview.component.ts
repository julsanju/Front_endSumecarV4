import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  styleUrls: ['./dialog-overview.component.css']
})
export class DialogOverviewComponent {
  cantidad: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    // Envía la cantidad al componente principal
    this.dialogRef.close(this.cantidad);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
