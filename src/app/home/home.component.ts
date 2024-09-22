import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  search(): void {
    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      // نمایش پیام موفقیت با SweetAlert2 و هدایت خودکار به صفحه جدید
      Swal.fire({
        title: 'با موفقیت انجام شد',
        icon: 'success',
        timer: 500, // مدت زمان نمایش پیام (به میلی‌ثانیه)
        timerProgressBar: true,
        didClose: () => {
          // تغییر مسیر به آدرس مورد نظر
          this.router.navigate(['/search'], { queryParams: { query: trimmedSearchTerm } });
        }
      });
    } else {
      // نمایش پیام خطا با SweetAlert2
      Swal.fire({
        title: 'خطا',
        text: 'لطفاً عبارت جستجو را وارد کنید.',
        icon: 'error',
        confirmButtonText: 'تأیید'
      });
    }
  }
}
