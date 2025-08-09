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
import { ApiCallService } from "../../services/api-call.service"

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

 
 

  
  

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private reviewService: ReviewService,
    private apiService:ApiCallService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = +params["id"]
      this.loadProduct(id)
      this.loadReviews(id)
    })
  }

  loadProduct(id: number) {
     this.apiService.GetcallWithoutToken(`Watch/GetWatchDetails?watchId=${id}`).subscribe((response: any) => {
      if(response.responseCode === 200) {
      this.product = {
        id: response.data.id,
        name: response.data.name,
        price: response.data.price,
        originalPrice: response.data.originalPrice,
        images: response.data.images,
        rating: response.data.rating,
        reviews: response.data.reviewsCount,
        badge: response.data.badge,
        category: response.data.category,
        brand: response.data.brand,
        movement: response.data.movement,
        material: response.data.material,
        waterResistance: response.data.waterResistance,
        caseDiameter: response.data.dimensions ? `${response.data.dimensions.width}mm` : '',
        description: response.data.description,
        features: response.data.features,
        specifications: {
          ...response.data.specifications,
          SKU: response.data.sku,
          Weight: response.data.weight ? `${response.data.weight}g` : '',
          Warranty: response.data.warranty ? `${response.data.warranty} Years` : '',
        }
      };
    } else {
      console.error("Failed to load product details", response.message);
      this.product = null;
    }
    }, (error: any) => {
      console.error("Error loading product details", error);
      this.product = null;

    });
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
