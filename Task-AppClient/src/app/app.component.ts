import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthService } from './Services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthInterceptor } from './Services/tokenInterceptor';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';

import { RouterLink } from '@angular/router';
import { TOKEN_KEY } from './Environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink
  ],
  providers: [DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'



})
export class AppComponent implements OnInit{
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Check login status when the component initializes
    this.updateLoginStatus();
  }

  logout() {
    console.log('Before logout, token:', localStorage.getItem(TOKEN_KEY));
    console.log('Before logout, access_token:', localStorage.getItem('access_token'));
    
    this.authService.logout();  // Log the user out by removing tokens
    
    console.log('After logout, token:', localStorage.getItem(TOKEN_KEY));
    console.log('After logout, access_token:', localStorage.getItem('access_token'));
    
    this.updateLoginStatus();   // Update the login status
    this.cdr.detectChanges();   // Trigger change detection
    this.router.navigate(['']);  // Redirect to the login page
  }
  
  
  private updateLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();  // Check if the user is logged in
  }
  
  // Call this method after successful login to update the state
  afterLogin() {
    this.updateLoginStatus();  // Recheck login status
    this.cdr.detectChanges();  // Trigger change detection manually
  }
}

