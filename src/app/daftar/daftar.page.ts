import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../provider/post-provider';

@Component({
  selector: 'app-daftar',
  templateUrl: './daftar.page.html',
  styleUrls: ['./daftar.page.scss'],
})
export class DaftarPage {
  formData = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private toastController: ToastController,
    private postPvdr: PostProvider
  ) {}

  async onSubmit() {
    // Validasi form
    if (!this.formData.fullName || !this.formData.username || !this.formData.password || !this.formData.confirmPassword) {
      this.showToast('Mohon lengkapi semua field', 'danger');
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.showToast('Password tidak cocok', 'danger');
      return;
    }

    if (this.formData.password.length < 6) {
      this.showToast('Password minimal 6 karakter', 'danger');
      return;
    }

    // Kirim data ke server
    let body = {
      aksi: 'register',
      fullName: this.formData.fullName,
      username: this.formData.username,
      password: this.formData.password
    };

    this.postPvdr.postData(body, 'action.php').subscribe(
      async (response: any) => {
        if (response.success) {
          this.showToast('Pendaftaran berhasil', 'success');
          this.router.navigate(['/login']);
        } else {
          this.showToast(response.msg || 'Username sudah digunakan', 'danger');
        }
      },
      async (error) => {
        this.showToast('Terjadi kesalahan', 'danger');
      }
    );
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}
