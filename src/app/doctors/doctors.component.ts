import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import Swal from 'sweetalert2'; // SweetAlert2 import
import moment from 'jalali-moment'; // default import for jalali-moment

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [
    { id: 1, name: 'محمد صابری', speciality: 'قلب' },
    { id: 3, name: 'احمد سعیدی', speciality: 'چشم' },
  ];
  selectedDoctor: any = null;
  availableSlots: any[] = [];
  isModalOpen: boolean = false;
  currentDate: string = ''; // Initialize as an empty string
  selectedSlotId: number | null = null;

  private apiurl = 'https://backendangular.vercel.app/api/products';

  ngOnInit() {
    this.currentDate = this.formatToJalali(new Date().toISOString().split('T')[0]);
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
        method: 'POST', // متد را به POST تغییر دهید
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
    return moment(date, 'YYYY-MM-DD').locale('fa').format('jYYYY/jMM/jDD'); // Ensure proper Jalali format
  }
}
