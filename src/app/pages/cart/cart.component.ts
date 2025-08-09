import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from '../../services/cart.service';
import { CardComponent, CardContentComponent, CardHeaderComponent } from '../../components/card/card.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {ionArrowBack,ionBag,ionAdd,ionShieldOutline, ionTrashBin} from '@ng-icons/ionicons';
import { heroMinus,heroXMark } from '@ng-icons/heroicons/outline';
import { featherMinusCircle, featherPlusCircle, featherTrash, featherTrash2, featherTruck } from '@ng-icons/feather-icons';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, FormsModule,CardComponent,CardContentComponent,NgIcon],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  viewProviders: [provideIcons({ ionArrowBack,featherTrash,ionTrashBin,featherTrash2,featherPlusCircle, ionBag,featherMinusCircle, heroMinus, ionAdd, heroXMark, ionShieldOutline, featherTruck })]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = []
  promoCode = ""


 

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items
    })
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  get savings(): number {
    return this.cartItems.reduce((sum, item) => {
      const itemSavings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0
      return sum + itemSavings
    }, 0)
  }

  get shipping(): number {
    return this.subtotal > 500 ? 0 : 25
  }

  get tax(): number {
    return this.subtotal * 0
  }

  get total(): number {
    return this.subtotal + this.shipping + this.tax
  }

  updateQuantity(id: number, quantity: number) {
    this.cartService.updateQuantity(id, quantity)
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id)
  }
}
