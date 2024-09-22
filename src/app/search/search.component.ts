import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // وارد کردن SweetAlert2
import moment from 'jalali-moment'; // اصلاح وارد کردن

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  doctors: any[] = [];
  selectedDoctor: any = null;
  availableSlots: any[] = [];
  isModalOpen: boolean = false;
  currentDate: string = this.formatToJalali(new Date().toISOString().split('T')[0]); // تغییر به فرمت شمسی
  selectedSlotId: number | null = null;



  private apiurl = 'https://backendangular.vercel.app/api/products';
  query: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      this.getdoctorquery(); // فراخوانی متد برای بارگذاری داده‌ها
    });
  }

  async getdoctorquery(): Promise<void> {
    try {
      const response = await fetch(`${this.apiurl}/search?name=${this.query}`);
      if (response.ok) {
        const data = await response.json();
        console.log('resultsearch => ', data);
        this.doctors = data; // نسبت دادن داده‌ها به متغیر doctors
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  }
  async getAvailableSlots(doctorId: number) {
    try {
      const response = await fetch(`${this.apiurl}/available-slots/${doctorId}`);
      if (!response.ok) throw new Error('Failed to fetch slots');
      const data = await response.json();
      this.availableSlots = data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  }

  openModal(doctor: any) {
    this.selectedDoctor = doctor;
    this.selectedSlotId = null;
    this.getAvailableSlots(doctor.id).then(() => {
      this.isModalOpen = true;
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async confirmSlotSelection(slot: any) {
    const result = await Swal.fire({
      title: `آیا مطمئنید که می‌خواهید زمان ${slot.time} را انتخاب کنید؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر',
    });

    if (result.isConfirmed) {
      this.selectedSlotId = slot.id;
      this.bookSlot(slot.id);
    }
  }

  async bookSlot(slotId: number) {
    try {
      const response = await fetch(`${this.apiurl}/book-slot/${slotId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      
      await Swal.fire({
        title: 'زمان با موفقیت رزرو شد!',
        icon: 'success',
      });
      
      this.closeModal();
      this.getAvailableSlots(this.selectedDoctor.id);
    } catch (error) {
      console.error('Error booking slot:', error);
      await Swal.fire({
        title: 'خطا در رزرو زمان',
        text: 'مشکلی در رزرو زمان وجود دارد. لطفاً دوباره تلاش کنید.',
        icon: 'error',
      });
    }
  }

  formatToJalali(date: string): string {
    return moment(date).format('jYYYY/jMM/jDD'); // تبدیل به تاریخ شمسی
  }

}
