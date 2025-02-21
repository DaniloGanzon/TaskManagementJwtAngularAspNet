import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { AbstractControl, FormBuilder, ValidatorFn, ValidationErrors, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDTO } from '../../Models/UserDto';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private appComponent: AppComponent
  ) {  }

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],  // Email is required and must be valid
    password: ['', [Validators.required]]  // Password is required
  });

  onSubmit() {
    this.isSubmitted = true;
  
    if (this.form.valid) {
      const user: UserDTO = this.form.value as UserDTO;
  
      this.authService.signin(user).subscribe({
        next: (res: any) => {
          // Check if the response contains the token
          if (res && res.accessToken) {
            localStorage.setItem('access_token', res.accessToken);  // Store token
            
            // Show the success toastr
            this.toastr.success('Login Successful', 'Welcome!');
            
            this.appComponent.afterLogin(); 
            // Navigate to home
            this.router.navigate(['/home']);
          } else {
            // If no token is returned, show an error toastr
            this.toastr.error('Invalid login credentials', 'Login Failed');
          }
        },
        error: (err) => {
          console.error('Login error', err);
          this.toastr.error('An error occurred. Please try again.', 'Login Failed');
        }
      });
    }
  }
  
}

