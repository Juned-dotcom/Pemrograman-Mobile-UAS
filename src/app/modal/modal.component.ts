import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() orderDetail: any;

  constructor(
    private modalController: ModalController
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  getStatusColor(status: string): string {
    if (status === 'Belum selesai') {
      return 'danger';
    } else if (status === 'Selesai') {
      return 'success';
    }
    return 'medium';  // default color
  }
}
