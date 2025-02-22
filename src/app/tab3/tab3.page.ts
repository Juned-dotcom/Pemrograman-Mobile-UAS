import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../provider/post-provider';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  pesanan: any[] = [];
  searchTerm: string = '';

  constructor(
    private router: Router,
    public toastController: ToastController,
    private postPvdr: PostProvider,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getPesanan();
  }

  ionViewWillEnter() {
    this.getPesanan();
  }

  
  getPesanan() {
    this.postPvdr.postData({ aksi: 'getPesanan' }, 'action.php').subscribe(data => {
      if (data.success) {
        this.pesanan = data.result;
      } else {
        console.error('Error fetching pesanan:', data.msg);
      }
    }, error => {
      console.error('Error fetching pesanan:', error);
    });
  }

  async updateStatus(pesanan: any) {
    const data = {
      aksi: 'updateStatus',
      id: pesanan.id,
      status: 'Selesai'
    };

    this.postPvdr.postData(data, 'action.php').subscribe(
      async (response: any) => {
        if (response.success) {
          const toast = await this.toastController.create({
            message: 'Status pesanan berhasil diperbarui',
            duration: 2000,
            position: 'top',
            color: 'success'
          });
          toast.present();
          
          // Refresh daftar pesanan
          this.getPesanan();
        } else {
          const toast = await this.toastController.create({
            message: 'Gagal memperbarui status pesanan',
            duration: 2000,
            position: 'top',
            color: 'danger'
          });
          toast.present();
        }
      },
      async error => {
        const toast = await this.toastController.create({
          message: 'Error: ' + error,
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
      }
    );
  }

  searchPesanan() {
    if (this.searchTerm.trim() === '') {
      this.getPesanan();
    } else {
      this.postPvdr.postData({ aksi: 'searchPesanan', searchTerm: this.searchTerm }, 'action.php').subscribe(data => {
        if (data.success) {
          this.pesanan = data.result;
        } else {
          console.error('Error searching pesanan:', data.msg);
        }
      }, error => {
        console.error('Error searching pesanan:', error);
      });
    }
  }

  async openDetailModal(pesanan: any) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        orderDetail: pesanan
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });

    await modal.present();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Belum di Bayar':
        return 'warning';
      case 'Diproses':
        return 'primary';
      case 'Selesai':
        return 'success';
      case 'Dibatalkan':
        return 'danger';
      default:
        return 'medium';
    }
  }
}

