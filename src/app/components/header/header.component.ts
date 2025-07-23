import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CartService } from '../../services/cart.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUser, heroXMark } from '@ng-icons/heroicons/outline';
import { ionCart, ionSunny, ionMoon, ionMenu } from '@ng-icons/ionicons';
import { featherUser } from '@ng-icons/feather-icons';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, NgIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  viewProviders: [provideIcons({ 
    ionCart, 
    ionSunny, 
    ionMoon, 
    ionMenu, 
    heroXMark ,
    heroUser,
    featherUser
  })]
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = false
  cartCount = 0
  isDarkMode$: any

  constructor(
    public themeService: ThemeService,
    private cartService: CartService,
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode$
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0)
    })
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false
  }
}

