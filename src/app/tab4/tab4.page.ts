import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../provider/post-provider';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page {
  formData = {
    name: '',
    email: '',
    topic: '',
    message: ''
  };

  constructor(
    private postPvdr: PostProvider,
    private toastController: ToastController
  ) {}

  async onSubmit() {
    // Validasi form
    if (!this.formData.name || !this.formData.email || !this.formData.topic || !this.formData.message) {
      const toast = await this.toastController.create({
        message: 'Mohon lengkapi semua field',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
      return;
    }

    // Validasi reCAPTCHA
    if (!(window as any).grecaptcha?.getResponse()) {
      const toast = await this.toastController.create({
        message: 'Mohon validasi reCAPTCHA',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
      return;
    }

    let body = {
      aksi: 'send_contact',
      ...this.formData
    };

    this.postPvdr.postData(body, 'action.php').subscribe(
      async (response) => {
        if (response.success) {
          const toast = await this.toastController.create({
            message: 'Pesan berhasil dikirim',
            duration: 2000,
            color: 'success',
            position: 'top'
          });
          toast.present();
          this.resetForm();
        } else {
          const toast = await this.toastController.create({
            message: 'Gagal mengirim pesan',
            duration: 2000,
            color: 'danger',
            position: 'top'
          });
          toast.present();
        }
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Terjadi kesalahan',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        toast.present();
      }
    );
  }

  private resetForm() {
    this.formData = {
      name: '',
      email: '',
      topic: '',
      message: ''
    };
    (window as any).grecaptcha?.reset();
  }
}
