import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes'; // مسیر صحیح به فایل روتینگ
import { NavbarComponent } from './navbar/navbar.component'; // مسیر صحیح به کامپوننت نوار ناوبری

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterModule , NavbarComponent],
  // به طور پیش فرض، RouterModule برای مسیریابی و RouterOutlet برای نمایش محتوای مسیر استفاده می‌شود.
})
export class AppComponent { }
