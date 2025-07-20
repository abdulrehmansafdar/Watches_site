import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"

export interface Review {
  id: number
  userId: number
  userName: string
  rating: number
  date: string
  comment: string
  verified: boolean
}

@Injectable({
  providedIn: "root",
})
export class ReviewService {
  private reviews: Review[] = [
    {
      id: 1,
      userId: 1,
      userName: "John Smith",
      rating: 5,
      date: "2024-01-15",
      comment: "Absolutely stunning watch! The craftsmanship is exceptional and it keeps perfect time.",
      verified: true,
    },
    {
      id: 2,
      userId: 2,
      userName: "Sarah Johnson",
      rating: 4,
      date: "2024-01-10",
      comment: "Beautiful design and great quality. The only minor issue is the strap could be more comfortable.",
      verified: true,
    },
    {
      id: 3,
      userId: 3,
      userName: "Michael Brown",
      rating: 5,
      date: "2024-01-05",
      comment: "This watch exceeded my expectations. Worth every penny!",
      verified: false,
    },
  ]

  getReviews(productId: number): Observable<Review[]> {
    return of(this.reviews)
  }

  addReview(productId: number, review: Omit<Review, "id">): Observable<Review> {
    const newReview: Review = {
      ...review,
      id: this.reviews.length + 1,
    }
    this.reviews.unshift(newReview)
    return of(newReview)
  }
}
