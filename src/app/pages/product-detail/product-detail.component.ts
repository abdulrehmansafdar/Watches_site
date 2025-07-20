import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule,  ActivatedRoute } from "@angular/router"
import { FormsModule } from "@angular/forms"
// import { CardComponent, CardContentComponent } from "../../components/ui/card.component"
import  { CartService } from "../../services/cart.service"
import  { ReviewService } from "../../services/review.service"
import { CardComponent, CardContentComponent } from "../../components/card/card.component"

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMinus, heroShare, heroStar } from '@ng-icons/heroicons/outline';
import { ionGridOutline, ionFilter, ionList, ionStar, ionHeart,ionBag, ionAdd, ionShieldOutline, ionRefresh } from '@ng-icons/ionicons';
import { featherTruck } from "@ng-icons/feather-icons"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviews: number
  badge?: string
  category: string
  brand: string
  movement: string
  material: string
  waterResistance: string
  caseDiameter: string
  description: string
  features: string[]
  specifications: { [key: string]: string }
}

interface Review {
  id: number
  userId: number
  userName: string
  rating: number
  date: string
  comment: string
  verified: boolean
}


@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, CardContentComponent, NgIcon],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  viewProviders: [provideIcons({ heroShare, ionGridOutline, ionFilter, ionList, ionStar, ionHeart,ionBag,heroMinus ,ionAdd,ionShieldOutline,featherTruck,ionRefresh,heroStar})]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null
  selectedImage = 0
  quantity = 1
  isWishlisted = false
  reviews: Review[] = []
  hasMoreReviews = true
  activeTab = 0

  tabs = [{ label: "Features" }, { label: "Specifications" }, { label: `Reviews (${this.reviews.length})` }]

  newReview = {
    rating: 0,
    userName: "",
    comment: "",
  }

 
 

  // Mock product data
  mockProduct: Product = {
    id: 1,
    name: "Chronos Elite",
    price: 899,
    originalPrice: 1299,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    category: "Luxury",
    brand: "Chronos",
    movement: "Automatic",
    material: "Stainless Steel",
    waterResistance: "100m",
    caseDiameter: "42mm",
    description:
      "The Chronos Elite represents the pinnacle of horological excellence. Crafted with precision and attention to detail, this timepiece features a Swiss automatic movement housed in a premium stainless steel case. The elegant design makes it perfect for both formal occasions and everyday wear.",
    features: [
      "Swiss automatic movement",
      "Sapphire crystal glass",
      "Stainless steel case and bracelet",
      "Water resistant to 100 meters",
      "Date display at 3 o'clock",
      "Luminous hands and markers",
    ],
    specifications: {
      "Case Material": "Stainless Steel",
      "Case Diameter": "42mm",
      "Case Thickness": "12mm",
      Movement: "Swiss Automatic",
      "Power Reserve": "42 hours",
      "Water Resistance": "100m",
      Crystal: "Sapphire",
      Strap: "Stainless Steel Bracelet",
    },
  }

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = +params["id"]
      this.loadProduct(id)
      this.loadReviews(id)
    })
  }

  loadProduct(id: number) {
    // In a real app, this would fetch from an API
    this.product = { ...this.mockProduct, id }
  }

  loadReviews(productId: number) {
    this.reviewService.getReviews(productId).subscribe((reviews) => {
      this.reviews = reviews
      this.tabs[2].label = `Reviews (${reviews.length})`
    })
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0)
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0)
  }

  getSpecifications(): { key: string; value: string }[] {
    if (!this.product) return []
    return Object.entries(this.product.specifications).map(([key, value]) => ({ key, value }))
  }

  increaseQuantity() {
    this.quantity++
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--
    }
  }

  addToCart() {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart({
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          originalPrice: this.product.originalPrice,
          image: this.product.images[0],
          category: this.product.category,
        })
      }
    }
  }

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted
  }

  setRating(rating: number) {
    this.newReview.rating = rating
  }

  isReviewValid(): boolean {
    return this.newReview.rating > 0 && this.newReview.userName.trim() !== "" && this.newReview.comment.trim() !== ""
  }

  submitReview() {
    if (this.isReviewValid() && this.product) {
      const review: Omit<Review, "id"> = {
        userId: 1, // In a real app, this would be the current user's ID
        userName: this.newReview.userName,
        rating: this.newReview.rating,
        date: new Date().toISOString().split("T")[0],
        comment: this.newReview.comment,
        verified: false,
      }

      this.reviewService.addReview(this.product.id, review).subscribe((newReview) => {
        this.reviews.unshift(newReview)
        this.newReview = { rating: 0, userName: "", comment: "" }
        this.tabs[2].label = `Reviews (${this.reviews.length})`
      })
    }
  }

  loadMoreReviews() {
    // Implementation for loading more reviews
    this.hasMoreReviews = false
  }
}
