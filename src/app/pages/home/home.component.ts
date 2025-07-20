import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"

import { CartService } from "../../services/cart.service"
import { CardComponent, CardContentComponent } from "../../components/card/card.component"
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRight, heroStar, heroHeart } from '@ng-icons/heroicons/outline';

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  badge: string
  category: string
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, CardContentComponent, NgIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({ heroArrowRight, heroStar, heroHeart })]
})
export class HomeComponent {
email = ""

  // Lucide icons
  ArrowRightIcon = heroArrowRight
  StarIcon = heroStar
  HeartIcon = heroHeart

  featuredProducts: Product[] = [
    {
      id: 1,
      name: "Chronos Elite",
      price: 899,
      originalPrice: 1299,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
      category: "Luxury",
    },
    {
      id: 2,
      name: "Minimal Classic",
      price: 299,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.6,
      reviews: 89,
      badge: "New",
      category: "Minimalist",
    },
    {
      id: 3,
      name: "Sport Pro",
      price: 599,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.9,
      reviews: 156,
      badge: "Popular",
      category: "Sport",
    },
    {
      id: 4,
      name: "Heritage Gold",
      price: 1299,
      image: "/placeholder.svg?height=400&width=400",
      rating: 4.7,
      reviews: 67,
      badge: "Limited",
      category: "Luxury",
    },
  ]

  collections = [
    {
      name: "Luxury Collection",
      description: "Exquisite timepieces for the discerning collector",
      image: "/placeholder.svg?height=300&width=400",
      count: "24 watches",
    },
    {
      name: "Sport Series",
      description: "Built for performance and adventure",
      image: "/placeholder.svg?height=300&width=400",
      count: "18 watches",
    },
    {
      name: "Minimalist Line",
      description: "Clean design meets modern functionality",
      image: "/placeholder.svg?height=300&width=400",
      count: "12 watches",
    },
  ]

  constructor(private cartService: CartService) {}

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0)
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0)
  }

  addToCart(product: Product) {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
    })
  }
}
 