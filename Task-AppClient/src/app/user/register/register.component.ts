import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, ValidationErrors, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserDTO } from '../../Models/UserDto';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  isSubmitted: boolean = false;
  
    constructor(
      private formBuilder: FormBuilder,
      private service: AuthService,
      private toastr: ToastrService
    ) {}
  
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');
      if (!password || !confirmPassword) return null;
      return password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
    }
  
    strongPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const password: string = control.value;
      if (!password) return null;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      return isValid ? null : { weakPassword: true };
    };
  
     // Define form group and validations
     form = this.formBuilder.group(
      {
        username: ['', Validators.required],   // Username is required
        email: ['', [Validators.required, Validators.email]],  // Email is required and must be in a valid format
        password: ['', [Validators.required, Validators.minLength(6), this.strongPasswordValidator]],  // Password required with strong password validation
        confirmPassword: ['', Validators.required],  // Confirm password required
      }, { validators: this.passwordMatchValidator }  // Apply custom validator for password confirmation
    );
  
    onSubmit() {
      this.isSubmitted = true;
      if (this.form.valid) {
        const user: UserDTO = this.form.value as UserDTO;
    
        this.service.signup(user).subscribe({
          next: (res: any) => {
            // If no content is returned (empty response body), assume registration success
            if (res === null || res === undefined) {
              this.toastr.success('Registration Successful', 'New User Created');
              this.form.reset();
              this.isSubmitted = false;
            } else {
              // If there's some response, handle it as success (if any message is returned)
              this.toastr.success('Registration Successful', 'New User Created');
              this.form.reset();
              this.isSubmitted = false;
            }
          },
          error: (err) => {
            console.error('Registration error', err);
    
            // Log all error messages to understand the response
            if (err.error && err.error.message) {
              this.toastr.error(err.error.message, 'Registration Failed');
            } else if (err.error && err.error.errors) {
              // If backend returns validation errors, log them
              const errors = err.error.errors;
              Object.keys(errors).forEach(field => {
                this.toastr.error(errors[field].join(', '), `${field} Error`);
              });
            } else {
              this.toastr.error('An error occurred. Please try again later.', 'Registration Failed');
            }
          }
        });
      }
    }
    
    
}

