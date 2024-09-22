import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
// حذف import برای HashLocationStrategy و LocationStrategy
// import { LocationStrategy, HashLocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    // حذف یا کامنت کردن خط زیر برای استفاده از PathLocationStrategy به طور پیش‌فرض
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
