import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"

import { CartService } from "../../services/cart.service"
import { CardComponent, CardContentComponent } from "../../components/card/card.component"
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRight, heroStar, heroHeart, heroEye, heroChevronLeft, heroChevronRight } from '@ng-icons/heroicons/outline';
import { ionBag, ionStar } from "@ng-icons/ionicons"

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  badge?: string
  category: string,
 
}

interface Collection {
  name: string
  image: string
  description: string
  count?: number
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, CardContentComponent, NgIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({ heroArrowRight, heroStar, heroHeart, heroEye, ionBag, ionStar, heroChevronLeft, heroChevronRight })]
})
export class HomeComponent {
  email = ""
  Math = Math

  // Organize products by categories
  productCategories = [
    {
      name: 'Luxury Collection',
      id: 'luxury',
      products: [
        {
          id: 1,
          name: "Chronos Elite",
          price: 899,
          originalPrice: 1299,
          image: "/assets/d-1.webp",
          rating: 4.8,
          reviews: 124,
          badge: "Best Seller",
          category: "Luxury",
        
        },
        {
          id: 2,
          name: "Heritage Gold",
          price: 1299,
          originalPrice: 1499,
          image: "/assets/d-2.webp",
          rating: 4.7,
          reviews: 89,
          badge: "Limited Edition",
          category: "Luxury",
        },
        {
          id: 3,
          name: "Shadow Black",
          price: 799,
          originalPrice: 999,
          image: "/assets/d-3.webp",
          rating: 4.5,
          reviews: 76,
          badge: "Trending",
          category: "Classic",
        },
        {
          id: 4,
          name: "Astra Steel",
          price: 1099,
          originalPrice: 1399,
          image: "/assets/d-4.webp",
          rating: 4.6,
          reviews: 52,
          badge: "Hot Deal",
          category: "Modern",
        },
        {
          id: 5,
          name: "Oceanic Blue",
          price: 950,
          originalPrice: 1150,
          image: "/assets/d-5.webp",
          rating: 4.4,
          reviews: 64,
          badge: "Top Pick",
          category: "Sport",
        },
        {
          id: 6,
          name: "Lunar Chrome",
          price: 1199,
          originalPrice: 1399,
          image: "/assets/d-6.webp",
          rating: 4.9,
          reviews: 101,
          badge: "Premium",
          category: "Luxury",
        },
        {
          id: 7,
          name: "Midnight Racer",
          price: 849,
          originalPrice: 999,
          image: "/assets/d-7.webp",
          rating: 4.6,
          reviews: 58,
          badge: "Best Value",
          category: "Sport",
        },
        {
          id: 8,
          name: "Rose Gold Charm",
          price: 999,
          originalPrice: 1199,
          image: "/assets/d-8.webp",
          rating: 4.7,
          reviews: 72,
          badge: "Editor's Choice",
          category: "Luxury",
        },
        {
          id: 9,
          name: "Desert Bronze",
          price: 975,
          originalPrice: 1125,
          image: "/assets/d-9.webp",
          rating: 4.5,
          reviews: 48,
          badge: "New Arrival",
          category: "Classic",
        },
        {
          id: 10,
          name: "Skyline Titanium",
          price: 1399,
          originalPrice: 1599,
          image: "/assets/d-10.webp",
          rating: 4.8,
          reviews: 83,
          badge: "Luxury Pick",
          category: "Modern",
        }
      ]

    },
    {
      name: 'Minimalist Collection',
      id: 'minimalist',
      products: [
        {
          id: 2,
          name: "Minimal Classic",
          price: 299,
          image: "/assets/d-2.webp",
          rating: 4.6,
          reviews: 89,
          badge: "New",
          category: "Minimalist",
          originalPrice: 399,
        }
      ]
    },
    {
      name: 'Sport Collection',
      id: 'sport',
      products: [
        {
          id: 3,
          name: "Sport Pro",
          price: 599,
          image: "/assets/d-3.webp",
          rating: 4.9,
          reviews: 156,
          badge: "Popular",
          category: "Sport",
          originalPrice: 699,
        }
      ]
    }
  ]

  collections: Collection[] = [
    {
      name: "Classic Heritage",
      image: "/assets/collection-1.jpg",
      count: 5,
      description: "Timeless elegance meets traditional craftsmanship in our heritage collection."
    },
    {
      name: "Modern Sport",
      image: "/assets/collection-2.jpg",
      count: 3,
      description: "Built for performance, designed for style. Perfect for the active lifestyle."
    },
    {
      name: "Luxury Elite",
      image: "/assets/collection-3.jpg",
      count: 4,
      description: "The pinnacle of horological excellence, featuring premium materials and complications."
    }
  ]

  currentSlides: { [key: string]: number } = {}

  constructor(private cartService: CartService) {
    // Initialize current slides for each category
    this.productCategories.forEach(category => {
      this.currentSlides[category.id] = 0
    })
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0)
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0)
  }
  scrollCarousel(categoryId: string, direction: 'left' | 'right') {
  const el = document.getElementById(`carousel-${categoryId}`);
  if (el) {
    const scrollAmount = 300; // px per card
    el.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  }
}

  // Carousel navigation methods
  nextSlide(categoryId: string) {
    const category = this.productCategories.find(c => c.id === categoryId)
    if (category) {
      const maxSlide = Math.max(0, category.products.length - 4) // Show 4 cards at once
      this.currentSlides[categoryId] = Math.min(this.currentSlides[categoryId] + 1, maxSlide)
    }
  }

  prevSlide(categoryId: string) {
    this.currentSlides[categoryId] = Math.max(0, this.currentSlides[categoryId] - 1)
  }

  getVisibleProducts(category: any) {
    const start = this.currentSlides[category.id]
    return category.products.slice(start, start + 4)
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
