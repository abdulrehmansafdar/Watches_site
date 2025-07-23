import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroCheck,
  heroShoppingBag,
  heroUser,
  heroMapPin,
  heroCreditCard,
  heroLockClosed,
  heroArrowLeft,
  heroArrowRight,
  heroCheckCircle,
  heroExclamationCircle,
  heroTruck,
  heroShieldCheck,
  heroGift
} from '@ng-icons/heroicons/outline';

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddressSame: boolean;
  billingAddress: ShippingInfo;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIcon],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  viewProviders: [provideIcons({ 
    heroCheck,
    heroShoppingBag,
    heroUser,
    heroMapPin,
    heroCreditCard,
    heroLockClosed,
    heroArrowLeft,
    heroArrowRight,
    heroCheckCircle,
    heroExclamationCircle,
    heroTruck,
    heroShieldCheck,
    heroGift
  })]
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  isProcessing = false;
  orderComplete = false;
  orderNumber = '';

  // Form Data
  shippingInfo: ShippingInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  };

  paymentInfo: PaymentInfo = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddressSame: true,
    billingAddress: { ...this.shippingInfo }
  };

  selectedShippingMethod = 'standard';
  promoCode = '';
  promoDiscount = 0;
  agreeToTerms = false;
  subscribeNewsletter = false;

  // Mock cart items (in real app, get from cart service)
  cartItems: CartItem[] = [
    {
      id: 1,
      name: "Chronos Explorer GMT",
      price: 1299,
      originalPrice: 1499,
      image: "/assets/products/watch-1.jpg",
      quantity: 1
    },
    {
      id: 2,
      name: "Vintage Elegance Classic",
      price: 899,
      image: "/assets/products/watch-2.jpg",
      quantity: 1
    }
  ];

  shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Free shipping on orders over $500',
      price: 0,
      estimatedDays: '5-7 business days',
      icon: 'heroTruck'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Faster delivery with tracking',
      price: 25,
      estimatedDays: '2-3 business days',
      icon: 'heroTruck'
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day delivery',
      price: 50,
      estimatedDays: '1 business day',
      icon: 'heroTruck'
    }
  ];

  countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
    'Italy', 'Spain', 'Australia', 'Japan', 'Switzerland'
  ];

  states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // In real app, load cart items from service
    this.generateOrderNumber();
  }

  generateOrderNumber() {
    this.orderNumber = 'CHR' + Date.now().toString().slice(-8);
  }

  // Step navigation
  nextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep || this.validateStepsUpTo(step - 1)) {
      this.currentStep = step;
    }
  }

  // Validation
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateShippingInfo();
      case 2:
        return this.validateShippingMethod();
      case 3:
        return this.validatePaymentInfo();
      case 4:
        return this.validateReview();
      default:
        return true;
    }
  }

  validateStepsUpTo(step: number): boolean {
    for (let i = 1; i <= step; i++) {
      const currentStepBackup = this.currentStep;
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        this.currentStep = currentStepBackup;
        return false;
      }
      this.currentStep = currentStepBackup;
    }
    return true;
  }

  validateShippingInfo(): boolean {
    return !!(
      this.shippingInfo.firstName &&
      this.shippingInfo.lastName &&
      this.shippingInfo.email &&
      this.shippingInfo.address &&
      this.shippingInfo.city &&
      this.shippingInfo.state &&
      this.shippingInfo.zipCode &&
      this.shippingInfo.country &&
      this.isValidEmail(this.shippingInfo.email)
    );
  }

  validateShippingMethod(): boolean {
    return !!this.selectedShippingMethod;
  }

  validatePaymentInfo(): boolean {
    return !!(
      this.paymentInfo.cardNumber &&
      this.paymentInfo.expiryDate &&
      this.paymentInfo.cvv &&
      this.paymentInfo.cardholderName &&
      this.isValidCardNumber(this.paymentInfo.cardNumber) &&
      this.isValidExpiryDate(this.paymentInfo.expiryDate) &&
      this.isValidCVV(this.paymentInfo.cvv)
    );
  }

  validateReview(): boolean {
    return this.agreeToTerms;
  }

  // Utility validation functions
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  }

  isValidExpiryDate(date: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(date)) return false;
    
    const [month, year] = date.split('/').map(num => parseInt(num));
    const now = new Date();
    const expiry = new Date(2000 + year, month - 1);
    
    return expiry > now;
  }

  isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  // Card number formatting
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formatted = value.replace(/(.{4})/g, '$1 ').trim();
    if (formatted.length > 19) {
      formatted = formatted.substring(0, 19);
    }
    this.paymentInfo.cardNumber = formatted;
    event.target.value = formatted;
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentInfo.expiryDate = value;
    event.target.value = value;
  }

  // Calculations
  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    const method = this.shippingMethods.find(m => m.id === this.selectedShippingMethod);
    return method ? method.price : 0;
  }

  getTax(): number {
    return Math.round((this.getSubtotal() * 0.0875) * 100) / 100; // 8.75% tax
  }

  getDiscount(): number {
    return this.promoDiscount;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTax() - this.getDiscount();
  }

  // Promo code
  applyPromoCode() {
    // Mock promo code logic
    const validCodes = {
      'WELCOME10': 0.10,
      'SAVE50': 50,
      'NEWUSER': 0.15
    };

    const upperCode = this.promoCode.toUpperCase();
    if (validCodes[upperCode as keyof typeof validCodes]) {
      const discount = validCodes[upperCode as keyof typeof validCodes];
      if (discount < 1) {
        this.promoDiscount = Math.round(this.getSubtotal() * discount * 100) / 100;
      } else {
        this.promoDiscount = discount;
      }
      alert('Promo code applied successfully!');
    } else {
      alert('Invalid promo code');
    }
  }

  // Order processing
  processOrder() {
    if (!this.validateReview()) {
      alert('Please agree to the terms and conditions');
      return;
    }

    this.isProcessing = true;

    // Simulate order processing
    setTimeout(() => {
      this.orderComplete = true;
      this.isProcessing = false;
      
      // In real app, clear cart and redirect
      setTimeout(() => {
        this.router.navigate(['/'], {
          queryParams: { orderComplete: true, orderNumber: this.orderNumber }
        });
      }, 3000);
    }, 3000);
  }

  // Billing address toggle
  toggleBillingAddress() {
    this.paymentInfo.billingAddressSame = !this.paymentInfo.billingAddressSame;
    if (this.paymentInfo.billingAddressSame) {
      this.paymentInfo.billingAddress = { ...this.shippingInfo };
    }
  }

  getCardType(): string {
    const number = this.paymentInfo.cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    if (number.startsWith('6')) return 'Discover';
    return '';
  }

  getStepIcon(step: number): string {
    switch (step) {
      case 1: return 'heroUser';
      case 2: return 'heroTruck';
      case 3: return 'heroCreditCard';
      case 4: return 'heroCheckCircle';
      default: return 'heroCheck';
    }
  }

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Shipping Information';
      case 2: return 'Delivery Method';
      case 3: return 'Payment Details';
      case 4: return 'Review & Place Order';
      default: return '';
    }
  }

  isStepComplete(step: number): boolean {
    if (step < this.currentStep) return true;
    if (step === this.currentStep) return false;
    return false;
  }

  isStepAccessible(step: number): boolean {
    return step <= this.currentStep;
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }
}