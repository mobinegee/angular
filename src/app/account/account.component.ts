import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 


export interface User {
  email: string;
  id: number;
  username: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  showloginorsign: boolean = true;
  showloginform: boolean = true;
  email: string = '';
  password: string = '';
  Authenticated: boolean = false;
  username: string = '';
  confirmPassword: string = '';
  user: User = { email: '', id: 0, username: '' };
  isLoading: boolean = false; 
  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true; // شروع بارگذاری
    await this.checkAuthenticationStatus();
    this.isLoading = false; // پایان بارگذاری
    console.log('انجیت انجام شد')
  }
  
  async checkAuthenticationStatus(): Promise<void> {
    console.log('اطلاعات کاربر گرفته شد')

    try {
      const token = localStorage.getItem('authorization');
  
      if (token) {
        await this.checkUserToken(); 
        this.showloginorsign = false; 
      } else {
        this.showloginform = true; 
        this.showloginorsign = true; 
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  }
  

  myFunction(): void {
    console.log('Button clicked');
  }

  choosestatusfalse(): void {
    this.showloginform = !this.showloginform;
  }

  async handleSubmit(): Promise<void> {
    try {
      const response = await fetch('https://backendangular.vercel.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();

      if (result && result.token) {
        localStorage.setItem('authorization', result.token);
        Swal.fire({
          title: 'ورود موفق',
          text: 'با موفقیت وارد حساب کاربری شدید!',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/']);
        });
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      Swal.fire({
        title: 'خطا',
        text: 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.',
        icon: 'error',
      });
    }
  }

  async handleregister(): Promise<void> {
    try {
      const response = await fetch('https://backendangular.vercel.app/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          email: this.email,
          password: this.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('authorization', result.token);
        Swal.fire({
          title: 'ثبت نام موفق',
          text: 'با موفقیت ثبت نام کردید!',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/']);
        });
      } else {
        Swal.fire({
          title: 'خطا',
          text: 'ثبت نام ناموفق بود. لطفاً دوباره تلاش کنید.',
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'خطا',
        text: 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
        icon: 'error',
      });
    }
  }

  async exitaccount(): Promise<void> {
    const result = await Swal.fire({
      title: 'خروج از حساب',
      text: 'آیا مطمئن هستید که می‌خواهید از حساب خارج شوید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر',
    });

    if (result.isConfirmed) {
      localStorage.removeItem('authorization');
      this.router.navigate(['/']);
      Swal.fire({
        title: 'خروج موفق',
        text: 'با موفقیت از حساب کاربری خارج شدید.',
        icon: 'success',
      });
    }
  }

  async checkUserToken(): Promise<void> {

    const token = localStorage.getItem('authorization');
  

    try {
      const response = await fetch('https://backendangular.vercel.app/api/users/user-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
  
      const data = await response.json();
  
      this.user = {
        email: data.user.email,
        id: data.user.id,
        username: data.user.username,
      };
  
      this.showloginform = false; 
     
    } catch (error) {
      console.error('Error:', error);
      this.showloginform = true; 
    }
  }
}
