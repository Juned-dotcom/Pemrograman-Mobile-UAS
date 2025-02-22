import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, ModalController, IonModal } from '@ionic/angular';
import { PostProvider } from '../../provider/post-provider';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  buyerName: string = '';
  buyerPhone: string = '';
  deliveryAddress: string = '';
  productInfo: string = '';
  productQuantity: number = 1;
  productImage: string = '';
  selectedFile: File | null = null;
  isAlertOpen: boolean = false;
  constructor(  
    private postPvdr: PostProvider,
    public toastController: ToastController,
    private alertController: AlertController,
    private modalCtrl:ModalController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  

  scrollToForm() {
    const element = document.getElementById('requestForm');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  addPesanan() {
    const pesananData = {
      buyer_name: this.buyerName,
      buyer_phone: this.buyerPhone,
      delivery_address: this.deliveryAddress,
      product_info: this.productInfo,
      product_quantity: this.productQuantity,
      product_image: this.productImage,
      status: 'Belum selesai',
      aksi: 'addpesanan'
    };

      this.postPvdr.postData(pesananData, 'action.php').subscribe(response => {
      if (response.success) {
        console.log('Pesanan berhasil ditambahkan:', response);
        this.isAlertOpen = true;
        this.presentToast('Pesanan berhasil ditambahkan!', 'success');
        this.resetForm();
        this.router.navigate(['/tabs/tab3']);
      } else {
        console.error('Pesanan gagal ditambahkan:', response.msg);
        this.presentToast('Gagal menambahkan pesanan', 'danger');
      }
    }, error => {
      console.error('Error pesanan:', error);
    });
  }
  
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  resetForm() {
    this.buyerName = '';
    this.buyerPhone = '';
    this.deliveryAddress = '';
    this.productInfo = '';
    this.productQuantity = 1;
    this.productImage = '';
    this.selectedFile = null;
  }
}
