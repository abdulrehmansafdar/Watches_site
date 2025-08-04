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
import { ApiCallService } from '../../services/api-call.service';
import { ThemeService } from '../../services/theme.service';

interface LoginForm {
  email: string;
  password: string;
 
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
  };

  constructor(private router: Router,
    private apiCallService: ApiCallService,
    private themeService: ThemeService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      const payload ={
        username: this.loginForm.email,
        password: this.loginForm.password,
      }
      
      // Simulate API call
      this.apiCallService.PostcallWithoutToken('User/LoginUser', payload).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.themeService.shownotification('Login successful', 'success');
          this.isLoading = false;
          // localStorage.setItem('token', response.token); // Assuming the response contains a token
            this.router.navigate(['/otp'], { queryParams: { email: this.loginForm.email } });
        },
        error: (error) => {
          console.error('Login failed', error);
          this.isLoading = false;
          // Handle error appropriately, e.g., show a notification
        }
      });
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
      this.loginForm.password.length >= 6
    );
  }
  
}