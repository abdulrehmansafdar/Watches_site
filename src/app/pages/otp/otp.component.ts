import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroShieldCheck,
  heroArrowLeft,
  heroArrowRight,
  heroClock,
  heroCheckCircle
} from '@ng-icons/heroicons/outline';
import { ApiCallService } from '../../services/api-call.service';
import { ThemeService } from '../../services/theme.service';

interface OtpForm {
  otp: string[];
  email?: string;
}

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIcon],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
  viewProviders: [provideIcons({
    heroShieldCheck,
    heroArrowLeft,
    heroArrowRight,
    heroClock,
    heroCheckCircle
  })]
})
export class OtpComponent implements OnInit, OnDestroy {
  isLoading = false;
  isResendingOtp = false;
  otpExpired = false;
  otpVerified = false;
  Math = Math;

  // Timer properties
  timeRemaining = 900; // 5 minutes in seconds
  timerDisplay = '15:00';
  private timerInterval: any;

  otpForm: OtpForm = {
    otp: ['', '', '', '', '', ''], // 6 digit OTP
    email: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiCallService: ApiCallService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    // Get email from query parameters if passed from login
    this.route.queryParams.subscribe(params => {
      this.otpForm.email = params['email'] || 'user@example.com';
    });

    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startTimer() {
    this.clearTimer();
    this.timeRemaining = 900; // Reset to 5 minutes
    this.otpExpired = false;

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();

      if (this.timeRemaining <= 0) {
        this.otpExpired = true;
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onOtpInput(index: number, event: any) {
    let value = event.target.value;

    // Only allow single digit numbers
    if (!/^\d$/.test(value) && value !== '') {
      event.target.value = this.otpForm.otp[index]; // Restore previous value
      return;
    }

    // Update the OTP array
    this.otpForm.otp[index] = value;

    // Auto-focus next input if value is entered and not the last field
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Auto-submit if all fields are filled
    if (this.isOtpComplete() && !this.otpExpired) {
      setTimeout(() => this.onSubmit(), 300);
    }
  }

  onOtpKeyDown(index: number, event: KeyboardEvent) {
    debugger
    // Handle number keys - allow them to replace current value
    if (/^\d$/.test(event.key)) {
      const input = event.target as HTMLInputElement;
      this.otpForm.otp[index] = event.key;

      // Move to next field
      if (index < 5) {
        setTimeout(() => {
          const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }, 10);
      }

      // Auto-submit if complete
      if (this.isOtpComplete() && !this.otpExpired) {
        setTimeout(() => this.onSubmit(), 300);
      }

      event.preventDefault();
      return;
    }

    // Handle backspace
   if (event.key === 'Backspace') {
  event.preventDefault();

  const input = event.target as HTMLInputElement;

  // Clear current field
  this.otpForm.otp[index] = '';
  input.value = '';

  // Move focus to previous field if possible, but don't clear its value
  if (index > 0) {
    debugger
    const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
    if (prevInput) {
      prevInput.focus();
      prevInput.select(); // Cursor inside previous field, ready to overwrite
    }
  }
  // If it's the first field, just clear it
  else {
  setTimeout(() => {
    const firstInput = document.querySelector(`input[data-index="0"]`) as HTMLInputElement;
    if (firstInput) {
      this.otpForm.otp[0] = '';
      firstInput.value = '';
      firstInput.focus();
      firstInput.select();
    }
  }, 0);
}
  return;
}

    // Handle Delete key
    // if (event.key === 'Delete') {
    //   event.preventDefault();
    //   this.otpForm.otp[index] = '';
    //   return;
    // }

    // Handle Arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
      return;
    }

    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
      return;
    }

    // Handle paste
    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');

        // Clear all fields first
        this.otpForm.otp = ['', '', '', '', '', ''];

        // Fill with pasted digits
        digits.forEach((digit, i) => {
          if (i < 6) {
            this.otpForm.otp[i] = digit;
          }
        });

        // Focus next empty field or last field
        const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
        const targetInput = document.querySelector(`input[data-index="${nextEmptyIndex}"]`) as HTMLInputElement;
        if (targetInput) {
          targetInput.focus();
        }

        // Auto-submit if all fields are filled
        if (digits.length === 6 && !this.otpExpired) {
          setTimeout(() => this.onSubmit(), 300);
        }
      });
      return;
    }

    // Prevent other keys
    if (!['Tab', 'Enter', 'Escape'].includes(event.key)) {
      event.preventDefault();
    }
  }

  isOtpComplete(): boolean {
    return this.otpForm.otp.every(digit => digit !== '');
  }

  getOtpValue(): string {
    return this.otpForm.otp.join('');
  }

  onSubmit() {
    if (!this.isOtpComplete()) {
      return;
    }

    // if (this.otpExpired) {
    //   alert('OTP has expired. Please request a new one.');
    //   return;
    // }

    this.isLoading = true;
    debugger
    // Simulate API call for OTP verification
    const payload = {
      otp: this.getOtpValue(),
      email: this.otpForm.email
    };
    this.apiCallService.PostcallWithoutToken('User/VerifyUser', payload).subscribe({
      next: (response) => {
        debugger
        console.log('OTP verified successfully', response);
        this.themeService.shownotification('OTP verified successfully', 'success');
        this.isLoading = false;
        this.otpVerified = true;
        localStorage.setItem('token', response.data.token); // Assuming the response contains a token
        // this.router.navigate(['/home']); // Navigate to home or dashboard
        setTimeout(() => {
          
          this.otpVerified = false;
          this.router.navigate(['/add-product']); // Navigate to home or dashboard
        },  3000); // Delay for 1 second before navigating
      },
      error: (error) => {
        console.error('OTP verification failed', error);
        this.isLoading = false;
        this.themeService.shownotification('OTP verification failed. Please try again.', 'error');
        // Handle error appropriately, e.g., show a notification
      }
    });


  }

  onResendOtp() {
    if (this.isResendingOtp) return;

    this.isResendingOtp = true;

    // Simulate API call for resending OTP
    setTimeout(() => {
      console.log('OTP resent to:', this.otpForm.email);
      this.startTimer(); // Restart timer
      this.clearOtp(); // Clear current OTP
      this.isResendingOtp = false;

      // Show success message (in real app, use toast service)
      alert('New OTP sent to your email!');
    }, 1500);
  }

  clearOtp() {
    this.otpForm.otp = ['', '', '', '', '', ''];

    // Clear all input values
    document.querySelectorAll('.otp-input').forEach((input: any) => {
      input.value = '';
    });

    // Focus first input
    setTimeout(() => {
      const firstInput = document.querySelector('input[data-index="0"]') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  getTimerColor(): string {
    if (this.timeRemaining <= 60) return 'text-red-500'; // Last minute - red
    if (this.timeRemaining <= 120) return 'text-yellow-500'; // Last 2 minutes - yellow
    return 'text-muted-foreground'; // Normal - gray
  }

  maskEmail(email: string): string {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;

    const maskedLocal = localPart.length > 2
      ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
      : localPart;

    return `${maskedLocal}@${domain}`;
  }
  onOtpFocus(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      input.select();
    }
  }
}