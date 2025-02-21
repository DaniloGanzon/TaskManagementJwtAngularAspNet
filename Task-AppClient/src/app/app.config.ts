import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

//toastr
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter} from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';



export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    BrowserAnimationsModule,
    provideAnimationsAsync(),
    provideToastr({positionClass:'toast-top-center'}), provideAnimationsAsync(),
    { provide: DateAdapter, useClass: NativeDateAdapter }, // Use NativeDateAdapter
    { provide: MAT_DATE_FORMATS, useValue: { parse: { dateInput: 'input' }, display: { dateInput: 'input' } } }
  ]
};
