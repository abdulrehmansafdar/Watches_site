import { Injectable, Inject, PLATFORM_ID } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { isPlatformBrowser } from "@angular/common"

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  quantity: number
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([])
  cartItems$ = this.cartItems.asObservable()

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCartFromStorage()
  }

  private loadCartFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart))
      }
    }
  }

  private saveCartToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("cart", JSON.stringify(this.cartItems.value))
    }
  }

  addToCart(item: Omit<CartItem, "quantity">) {
    const currentItems = this.cartItems.value
    const existingItem = currentItems.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      currentItems.push({ ...item, quantity: 1 })
    }

    this.cartItems.next([...currentItems])
    this.saveCartToStorage()
  }

  removeFromCart(id: number) {
    const currentItems = this.cartItems.value.filter((item) => item.id !== id)
    this.cartItems.next(currentItems)
    this.saveCartToStorage()
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(id)
      return
    }

    const currentItems = this.cartItems.value
    const item = currentItems.find((cartItem) => cartItem.id === id)

    if (item) {
      item.quantity = quantity
      this.cartItems.next([...currentItems])
      this.saveCartToStorage()
    }
  }

  clearCart() {
    this.cartItems.next([])
    this.saveCartToStorage()
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0)
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
  }
}
