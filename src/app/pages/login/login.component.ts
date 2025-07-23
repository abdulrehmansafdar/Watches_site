import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroEye, 
  heroEyeSlash, 
  heroEnvelope, 
  heroLockClosed,
  heroUser,
  heroArrowRight 
} from '@ng-icons/heroicons/outline';
import { ionLogoGoogle, ionLogoApple, ionLogoFacebook } from '@ng-icons/ionicons';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  viewProviders: [provideIcons({ 
    heroEye, 
    heroEyeSlash, 
    heroEnvelope, 
    heroLockClosed,
    heroUser,
    heroArrowRight,
    ionLogoGoogle,
    ionLogoApple,
    ionLogoFacebook
  })]
})
export class LoginComponent {
  showPassword = false;
  isLoading = false;
  
  loginForm: LoginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Login submitted:', this.loginForm);
        this.isLoading = false;
        // Navigate to home or dashboard
        this.router.navigate(['/otp']);
      }, 2000);
    }
  }

  socialLogin(provider: string) {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  }

   isFormValid(): boolean {
    return !!(
      this.loginForm.email && 
      this.loginForm.password &&
      this.loginForm.email.includes('@') &&
      this.loginForm.password.length >= 6
    );
  }
}